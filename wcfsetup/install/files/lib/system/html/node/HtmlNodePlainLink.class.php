<?php

namespace wcf\system\html\node;

use wcf\data\bbcode\BBCode;
use wcf\data\ITitledObject;
use wcf\system\Regex;
use wcf\util\DOMUtil;
use wcf\util\JSON;

/**
 * Wrapper for links that do not have a dedicated title and are most likely the result of
 * the automatic link detection. Links that are placed in a dedicated line ("standalone")
 * are marked as such.
 *
 * @author      Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license     GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since       5.2
 */
class HtmlNodePlainLink
{
    /**
     * @var string
     */
    protected $href = '';

    /**
     * @var \DOMElement
     */
    protected $link;

    /**
     * @var int
     */
    protected $objectID = 0;

    /**
     * @var bool
     */
    protected $pristine = true;

    /**
     * @var bool
     */
    protected $standalone = false;

    protected bool $aloneInParagraph = true;

    /**
     * @var \DOMElement
     */
    protected $topLevelParent;

    /**
     * @param \DOMElement $link
     * @param string $href
     */
    public function __construct(\DOMElement $link, $href)
    {
        $this->link = $link;
        $this->href = $href;
    }

    /**
     * Marks the link as inline, which means that there is adjacent objects or text
     * in the same line.
     *
     * @return $this
     */
    public function setIsInline()
    {
        $this->standalone = false;
        $this->topLevelParent = null;

        return $this;
    }

    /**
     * Marks the link as standalone, which means that it is the only content in a line.
     *
     * @param \DOMElement $topLevelParent
     * @param bool $aloneInParagraph
     * @return $this
     */
    public function setIsStandalone(\DOMElement $topLevelParent, bool $aloneInParagraph = true)
    {
        $this->standalone = true;
        $this->topLevelParent = $topLevelParent;
        $this->aloneInParagraph = $aloneInParagraph;

        return $this;
    }

    /**
     * Returns true if the element has not been modified before.
     *
     * @return bool
     */
    public function isPristine()
    {
        return $this->pristine;
    }

    /**
     * Returns true if the element was placed in a dedicated line.
     *
     * @return bool
     */
    public function isStandalone()
    {
        return $this->standalone;
    }

    /**
     * Detects and stores the object id of the link.
     *
     * @param Regex $regex
     * @return int
     */
    public function detectObjectID(Regex $regex)
    {
        if ($regex->match($this->href, true)) {
            $this->objectID = $regex->getMatches()[2][0];
        }

        return $this->objectID;
    }

    /**
     * @return int
     */
    public function getObjectID()
    {
        return $this->objectID;
    }

    /**
     * Replaces the text content of the link with the object's title.
     *
     * @param ITitledObject $object
     */
    public function setTitle(ITitledObject $object)
    {
        $this->markAsTainted();

        $this->link->nodeValue = '';
        $this->link->appendChild($this->link->ownerDocument->createTextNode($object->getTitle()));
    }

    /**
     * Replaces the entire link, including any formatting, with the provided bbcode. This is
     * available for standalone links only.
     *
     * @param BBCode $bbcode
     * @param int|null $overrideObjectID
     */
    public function replaceWithBBCode(BBCode $bbcode, $overrideObjectID = null)
    {
        $this->markAsTainted();

        if ($this->objectID === 0) {
            throw new \UnexpectedValueException('The objectID must not be zero.');
        }

        $metacodeElement = $this->link->ownerDocument->createElement('woltlab-metacode');
        $metacodeElement->setAttribute('data-name', $bbcode->bbcodeTag);
        $metacodeElement->setAttribute(
            'data-attributes',
            \base64_encode(JSON::encode([($overrideObjectID !== null ? $overrideObjectID : $this->objectID)]))
        );

        if ($bbcode->isBlockElement) {
            if (!$this->isStandalone()) {
                throw new \LogicException('Cannot inject a block bbcode in an inline context.');
            }

            if ($this->aloneInParagraph) {
                // Replace the top level parent with the link itself, which will be replaced with the bbcode afterwards.
                $this->topLevelParent->parentNode->insertBefore($this->link, $this->topLevelParent);
                DOMUtil::removeNode($this->topLevelParent);
            } else {
                //Split at the link and replace the link with the metacode element.
                $next = $this->findBr($this->link, 'nextSibling');
                $previous = $this->findBr($this->link, 'previousSibling');
                $replaceNode = null;

                if ($next !== null) {
                    $replaceNode = DOMUtil::splitParentsUntil(
                        $this->link,
                        $this->link->parentElement->parentElement,
                        false
                    );
                }
                if ($previous !== null) {
                    $replaceNode = DOMUtil::splitParentsUntil(
                        $this->link,
                        $this->link->parentElement->parentElement
                    );
                }
                \assert($replaceNode instanceof \DOMElement);

                //remove <br> from start and end of the new block elements
                if ($replaceNode->nextSibling !== null) {
                    $br = $this->findBr($replaceNode->nextSibling->firstChild, 'nextSibling');
                    if ($br !== null) {
                        DOMUtil::removeNode($br);
                    }
                }
                if ($replaceNode->previousSibling !== null) {
                    $br = $this->findBr($replaceNode->previousSibling->lastChild, 'previousSibling');
                    if ($br !== null) {
                        DOMUtil::removeNode($br);
                    }
                }
                DOMUtil::replaceElement($replaceNode, $metacodeElement, false);

                return;
            }
        }

        DOMUtil::replaceElement($this->link, $metacodeElement, false);
    }

    protected function markAsTainted()
    {
        if (!$this->pristine) {
            throw new \RuntimeException('This link has already been modified.');
        }

        $this->pristine = false;
    }

    private function findBr(?\DOmNode $node, string $property): ?\DOmNode
    {
        if ($node === null) {
            return null;
        }

        if ($node->nodeName === 'br') {
            return $node;
        }

        return $this->findBr($node->{$property}, $property);
    }
}

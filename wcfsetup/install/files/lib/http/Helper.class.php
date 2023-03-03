<?php

namespace wcf\http;

use CuyZ\Valinor\Mapper\MappingError;
use CuyZ\Valinor\Mapper\Source\Source;
use CuyZ\Valinor\MapperBuilder;
use Negotiation\Accept;
use Negotiation\Negotiator;
use Psr\Http\Message\RequestInterface;

/**
 * Provides various helper methods for PSR-7/PSR-15 request processing.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2022 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   6.0
 */
final class Helper
{
    /**
     * Returns whether the request's 'x-requested-with' header is equal
     * to 'XMLHttpRequest'.
     */
    public static function isAjaxRequest(RequestInterface $request): bool
    {
        return $request->getHeaderLine('x-requested-with') === 'XMLHttpRequest';
    }

    /**
     * Returns the MIME type the client prefers most from the input list of
     * $availableTypes. If multiple MIME types are equally acceptable, the
     * one that comes first in the input list will be returned. If no MIME
     * type is acceptable, the first item in the input list will be returned.
     *
     * Checks the request's 'accept' header.
     *
     * @param list<string> $availableTypes
     */
    public static function getPreferredContentType(RequestInterface $request, array $availableTypes): string
    {
        if (!$request->hasHeader('accept')) {
            // Anything is acceptable, use the server-preferred type.
            return $availableTypes[0];
        }

        $negotiator = new Negotiator();

        $best = $negotiator->getBest($request->getHeaderLine('accept'), $availableTypes);

        if ($best === null) {
            // Nothing is acceptable, use the server-preferred type.
            return $availableTypes[0];
        }

        \assert($best instanceof Accept);

        return $best->getValue();
    }

    /**
     * Validates query parameters against the provided schema. Unknown
     * keys are skipped and values are gracefully converted into the
     * requested types.
     *
     * The returned array will contain only the values specified in the
     * schema. Missing parameters or values that cannot be casted to the
     * requested type will yield a `MappingError`.
     *
     * @throws MappingError
     */
    public static function mapQueryParameters(array $queryParameters, string $schema): mixed
    {
        $mapper = (new MapperBuilder())
            ->allowSuperfluousKeys()
            ->enableFlexibleCasting()
            ->mapper();

        return $mapper->map(
            $schema,
            Source::array($queryParameters)
        );
    }

    /**
     * Validates body parameters against the provided schema. Expects
     * the data source to be JSON and thus values to be of the correct
     * data type. Unknown keys will be rejected.
     *
     * Missing parameters or values that cannot be casted to the requested
     * type will yield a `MappingError`.
     *
     * @throws MappingError
     */
    public static function mapRequestBody(array $bodyParameters, string $schema): mixed
    {
        $mapper = (new MapperBuilder())
            ->mapper();

        return $mapper->map(
            $schema,
            Source::array($bodyParameters)
        );
    }

    /**
     * Forbid creation of Helper objects.
     */
    private function __construct()
    {
        // does nothing
    }
}

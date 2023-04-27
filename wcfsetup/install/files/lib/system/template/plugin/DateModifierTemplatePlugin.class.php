<?php

namespace wcf\system\template\plugin;

use wcf\system\template\TemplateEngine;
use wcf\system\WCF;
use wcf\util\DateUtil;

/**
 * Template modifier plugin which renders a \DateTimeInterface or
 * a unix timestamp into a date-only format.
 *
 * Usage:
 *  {$timestamp|date}
 *  {"132845333"|date:"Y-m-d"}
 *
 * @author  Marcel Werk
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @deprecated 6.0 use `{time type='plainDate'}` or `{time type='custom'}` instead
 */
class DateModifierTemplatePlugin implements IModifierTemplatePlugin
{
    /**
     * @inheritDoc
     */
    public function execute($tagArgs, TemplateEngine $tplObj)
    {
        if ($tagArgs[0] instanceof \DateTimeInterface) {
            $dateTime = $tagArgs[0];
        } else {
            $timestamp = \intval($tagArgs[0]);
            $dateTime = new \DateTimeImmutable('@' . $timestamp);
        }

        if (!empty($tagArgs[1])) {
            return DateUtil::format(
                $dateTime,
                $tagArgs[1]
            );
        } else {
            return \IntlDateFormatter::create(
                WCF::getLanguage()->getLocale(),
                \IntlDateFormatter::LONG,
                \IntlDateFormatter::NONE,
                WCF::getUser()->getTimeZone()
            )->format($dateTime);
        }
    }
}

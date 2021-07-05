<?php

/**
 * Checks the increased system requirements.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core
 */

use wcf\system\WCF;

$phpVersion = \PHP_VERSION;
$neededPhpVersion = '7.2.24';
if (!\version_compare($phpVersion, $neededPhpVersion, '>=')) {
    if (WCF::getLanguage()->getFixedLanguageCode() === 'de') {
        $message = "Ihre PHP-Version '{$phpVersion}' ist unzureichend f&uuml;r die Installation dieser Software. PHP-Version {$neededPhpVersion} oder h&ouml;her wird ben&ouml;tigt.";
    } else {
        $message = "Your PHP version '{$phpVersion}' is insufficient for installation of this software. PHP version {$neededPhpVersion} or greater is required.";
    }

    throw new \RuntimeException($message);
}

$sqlVersion = WCF::getDB()->getVersion();
$compareSQLVersion = \preg_replace('/^(\d+\.\d+\.\d+).*$/', '\\1', $sqlVersion);
if (\stripos($sqlVersion, 'MariaDB') !== false) {
    $neededSqlVersion = '10.1.44';
    $sqlFork = 'MariaDB';
} else {
    $sqlFork = 'MySQL';
    if ($compareSQLVersion[0] === '5') {
        $neededSqlVersion = '5.7.31';
    } else {
        $neededSqlVersion = '8.0.19';
    }
}

if (!\version_compare($compareSQLVersion, $neededSqlVersion, '>=')) {
    if (WCF::getLanguage()->getFixedLanguageCode() === 'de') {
        $message = "Ihre {$sqlFork}-Version '{$sqlVersion}' ist unzureichend f&uuml;r die Installation dieser Software. {$sqlFork}-Version {$neededSqlVersion} oder h&ouml;her wird ben&ouml;tigt.";
    } else {
        $message = "Your {$sqlFork} version '{$sqlVersion}' is insufficient for installation of this software. {$sqlFork} version {$neededSqlVersion} or greater is required.";
    }

    throw new \RuntimeException($message);
}

if (
    \extension_loaded('imagick')
    && !\in_array('WEBP', \Imagick::queryFormats())
) {
    if (WCF::getLanguage()->getFixedLanguageCode() === 'de') {
        $message = "Unterstützung für WebP-Grafiken in Imagick fehlt";
    } else {
        $message = "Support for WebP images in Imagick missing";
    }

    throw new \RuntimeException($message);
}

if (
    \extension_loaded('gd')
    && empty(\gd_info()['WebP Support'])
) {
    if (WCF::getLanguage()->getFixedLanguageCode() === 'de') {
        $message = "Unterstützung für WebP-Grafiken in GD fehlt";
    } else {
        $message = "Support for WebP images in GD missing";
    }

    throw new \RuntimeException($message);
}

<?php

namespace wcf\system\exception;

/**
 * Default exception for HTTP status code "401 Unauthorized" and "403 Forbidden".
 *
 * @author  Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @deprecated 5.3 This exception was created for use with HTTPRequest which is deprecated.
 */
class HTTPUnauthorizedException extends SystemException
{
}

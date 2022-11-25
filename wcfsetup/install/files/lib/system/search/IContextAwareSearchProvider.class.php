<?php

namespace wcf\system\search;

use wcf\data\search\ISearchResultObject;
use wcf\system\database\util\PreparedStatementConditionBuilder;

/**
 * Interface for full-text search providers that provide
 * additional context information for messages.
 *
 * @author Alexander Ebert
 * @copyright 2001-2022 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Search
 * @since 6.0
 */
interface IContextAwareSearchProvider extends ISearchProvider
{
    /**
     * Returns the context filter that is being applied
     * to the inner search query.
     */
    public function getContextFilter(array $parameters): array;
}

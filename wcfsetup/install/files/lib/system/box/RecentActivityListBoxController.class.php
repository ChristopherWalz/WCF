<?php
namespace wcf\system\box;
use wcf\data\user\activity\event\ViewableUserActivityEventList;
use wcf\system\request\LinkHandler;
use wcf\system\user\activity\event\UserActivityEventHandler;
use wcf\system\WCF;

/**
 * Box controller for a list of recent activities.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2016 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Box
 * @since	3.0
 * 
 * @property	ViewableUserActivityEventList	$objectList
 */
class RecentActivityListBoxController extends AbstractDatabaseObjectListBoxController {
	/**
	 * is true if the list of recent activity can be filtered to only include
	 * activities by followed users
	 * @var	boolean
	 */
	public $canFilterByFollowedUsers = false;
	
	/**
	 * @inheritDoc
	 */
	public $conditionDefinition = 'com.woltlab.wcf.box.recentActivityList.condition';
	
	/**
	 * is true if the list of recent activity is filtered to only include
	 * activities by followed users
	 * @var	boolean
	 */
	public $filteredByFollowedUsers = false;
	
	/**
	 * @inheritDoc
	 */
	public $defaultLimit = 10;
	
	/**
	 * @inheritDoc
	 */
	public $maximumLimit = 50;
	
	/**
	 * @inheritDoc
	 */
	public $minimumLimit = 5;
	
	/**
	 * @inheritDoc
	 */
	protected static $supportedPositions = ['contentTop', 'contentBottom', 'sidebarLeft', 'sidebarRight'];
	
	/**
	 * @inheritDoc
	 */
	public function __construct() {
		/** @noinspection PhpUndefinedMethodInspection */
		if (WCF::getUser()->userID && count(WCF::getUserProfileHandler()->getFollowingUsers())) {
			$this->canFilterByFollowedUsers = true;
		}
		
		if ($this->canFilterByFollowedUsers && WCF::getUser()->recentActivitiesFilterByFollowing) {
			$this->filteredByFollowedUsers = true;
		}
		
		parent::__construct();
	}
	
	/**
	 * @inheritDoc
	 */
	public function getLink() {
		return LinkHandler::getInstance()->getLink('RecentActivityList');
	}
	
	/**
	 * @inheritDoc
	 */
	protected function getObjectList() {
		return new ViewableUserActivityEventList();
	}
	
	/**
	 * @inheritDoc
	 */
	public function getTemplate() {
		if ($this->getBox()->position == 'contentTop' || $this->getBox()->position == 'contentBottom') {
			/** @noinspection PhpUndefinedMethodInspection */
			return WCF::getTPL()->fetch('boxRecentActivity', 'wcf', [
				'canFilterByFollowedUsers' => $this->canFilterByFollowedUsers,
				'eventList' => $this->objectList,
				'lastEventTime' => $this->objectList->getLastEventTime(),
				'filteredByFollowedUsers' => $this->filteredByFollowedUsers
			], true);
		}
		else {
			return WCF::getTPL()->fetch('boxRecentActivitySidebar', 'wcf', [
				'eventList' => $this->objectList
			], true);
		}
	}
	
	/**
	 * @inheritDoc
	 */
	public function hasLink() {
		return true;
	}
	
	/**
	 * @inheritDoc
	 */
	protected function readObjects() {
		// apply filter
		if (($this->getBox()->position == 'contentTop' || $this->getBox()->position == 'contentBottom') && $this->filteredByFollowedUsers) {
			/** @noinspection PhpUndefinedMethodInspection */
			$this->objectList->getConditionBuilder()->add('user_activity_event.userID IN (?)', [WCF::getUserProfileHandler()->getFollowingUsers()]);
		}
		
		// load more items than necessary to avoid empty list if some items are invisible for current user
		$this->objectList->sqlLimit = $this->box->limit * 3;
		
		parent::readObjects();
		
		// removes orphaned and non-accessible events
		/** @noinspection PhpParamsInspection */
		UserActivityEventHandler::validateEvents($this->objectList);
		
		// remove unused items
		$this->objectList->truncate($this->box->limit);
	}
}

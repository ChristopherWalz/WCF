<?php
namespace wcf\system\captcha;
use wcf\system\recaptcha\RecaptchaHandlerV2;
use wcf\system\WCF;

/**
 * Captcha handler for reCAPTCHA.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2019 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Captcha
 */
class RecaptchaHandler implements ICaptchaHandler {
	/**
	 * recaptcha challenge
	 * @var	string
	 */
	public $challenge = '';
	
	/**
	 * response to the challenge
	 * @var	string
	 */
	public $response = '';
	
	/**
	 * ACP option override
	 * @var boolean
	 */
	public static $forceIsAvailable = false;
	
	/**
	 * @inheritDoc
	 */
	public function getFormElement() {
		if (WCF::getSession()->getVar('recaptchaDone')) return '';
		
		WCF::getTPL()->assign([
			'recaptchaLegacyMode' => true
		]);
		
		return WCF::getTPL()->fetch('recaptcha');
	}
	
	/**
	 * @inheritDoc
	 */
	public function isAvailable() {
		if (!RECAPTCHA_PUBLICKEY || !RECAPTCHA_PRIVATEKEY) {
			// OEM keys are no longer supported, disable reCAPTCHA
			if (self::$forceIsAvailable) {
				// work-around for the ACP option selection
				return true;
			}
			
			return false;
		}
		
		return true;
	}
	
	/**
	 * @inheritDoc
	 */
	public function readFormParameters() {
		if (isset($_POST['recaptcha-type'])) $this->challenge = $_POST['recaptcha-type'];
		if (isset($_POST['g-recaptcha-response'])) $this->response = $_POST['g-recaptcha-response'];
	}
	
	/**
	 * @inheritDoc
	 */
	public function reset() {
		WCF::getSession()->unregister('recaptchaDone');
	}
	
	/**
	 * @inheritDoc
	 */
	public function validate() {
		if (WCF::getSession()->getVar('recaptchaDone')) return;
		
		RecaptchaHandlerV2::getInstance()->validate($this->response, $this->challenge ?: 'v2');
	}
}

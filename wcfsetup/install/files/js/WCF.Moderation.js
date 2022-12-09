"use strict";

/**
 * Namespace for moderation related classes.
 * 
 * @author	Alexander Ebert
 * @copyright	2001-2019 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 */
WCF.Moderation = { };

if (COMPILER_TARGET_DEFAULT) {
	/**
	 * Moderation queue management.
	 *
	 * @param        integer                queueID
	 * @param        string                redirectURL
	 */
	WCF.Moderation.Management = Class.extend({
		/**
		 * button selector
		 * @var        string
		 */
		_buttonSelector: '',
		
		/**
		 * action class name
		 * @var        string
		 */
		_className: '',
		
		/**
		 * list of templates for confirmation message by action name
		 * @var        object
		 */
		_confirmationTemplate: {},
		
		/**
		 * dialog overlay
		 * @var        jQuery
		 */
		_dialog: null,
		
		/**
		 * language item pattern
		 * @var        string
		 */
		_languageItem: '',
		
		/**
		 * action proxy
		 * @var        WCF.Action.Proxy
		 */
		_proxy: null,
		
		/**
		 * queue id
		 * @var        integer
		 */
		_queueID: 0,
		
		/**
		 * redirect URL
		 * @var        string
		 */
		_redirectURL: '',
		
		/**
		 * Initializes the moderation report management.
		 *
		 * @param        integer                queueID
		 * @param        string                redirectURL
		 * @param        string                languageItem
		 */
		init: function (queueID, redirectURL, languageItem) {
			if (!this._buttonSelector) {
				console.debug("[WCF.Moderation.Management] Missing button selector, aborting.");
				return;
			}
			else if (!this._className) {
				console.debug("[WCF.Moderation.Management] Missing class name, aborting.");
				return;
			}
			
			this._dialog = null;
			this._queueID = queueID;
			this._redirectURL = redirectURL;
			this._languageItem = languageItem;
			
			this._proxy = new WCF.Action.Proxy({
				failure: $.proxy(this._failure, this),
				success: $.proxy(this._success, this)
			});
			
			$(this._buttonSelector).click($.proxy(this._click, this));
		},
		
		/**
		 * Handles clicks on the action buttons.
		 *
		 * @param        object                event
		 */
		_click: function (event) {
			var $actionName = $(event.currentTarget).wcfIdentify();
			var $innerTemplate = '';
			if (this._confirmationTemplate[$actionName]) {
				$innerTemplate = this._confirmationTemplate[$actionName];
			}
			
			WCF.System.Confirmation.show(WCF.Language.get(this._languageItem.replace(/{actionName}/, $actionName)), $.proxy(function (action, parameters, content) {
				if (action === 'confirm') {
					var $parameters = {
						actionName: $actionName,
						className: this._className,
						objectIDs: [this._queueID]
					};
					if (this._confirmationTemplate[$actionName]) {
						$parameters.parameters = {};
						$(content).find('input, textarea').each(function (index, element) {
							var $element = $(element);
							var $value = $element.val();
							if ($element.getTagName() === 'input' && $element.attr('type') === 'checkbox') {
								if (!$element.is(':checked')) {
									$value = null;
								}
							}
							
							if ($value !== null) {
								$parameters.parameters[$element.attr('name')] = $value;
							}
						});
					}
					
					this._proxy.setOption('data', $parameters);
					this._proxy.sendRequest();
					
					$(this._buttonSelector).disable();
				}
			}, this), {}, $innerTemplate);
		},
		
		/**
		 * Handles successful AJAX requests.
		 *
		 * @param        object                data
		 * @param        string                textStatus
		 * @param        jQuery                jqXHR
		 */
		_success: function (data, textStatus, jqXHR) {
			var $notification = new WCF.System.Notification(WCF.Language.get('wcf.global.success'));
			var self = this;
			$notification.show(function () {
				window.location = self._redirectURL;
			});
		}
	});
}
else {
	WCF.Moderation.Management = Class.extend({
		_buttonSelector: "",
		_className: "",
		_confirmationTemplate: {},
		_dialog: {},
		_languageItem: "",
		_proxy: {},
		_queueID: 0,
		_redirectURL: "",
		init: function() {},
		_click: function() {},
		_success: function() {},
	});
}

/**
 * Namespace for moderation queue related classes.
 */
WCF.Moderation.Queue = { };

if (COMPILER_TARGET_DEFAULT) {
	/**
	 * Marks one moderation queue entry as read.
	 * 
	 * @deprecated  6.0, use `WoltLabSuite/Core/Ui/Moderation/MarkAsRead` instead
	 */
	WCF.Moderation.Queue.MarkAsRead = Class.extend({
		/**
		 * action proxy
		 * @var        WCF.Action.Proxy
		 */
		_proxy: null,
		
		/**
		 * Initializes the mark as read for queue entries.
		 */
		init: function () {
			this._proxy = new WCF.Action.Proxy({
				success: $.proxy(this._success, this)
			});
			
			$(document).on('dblclick', '.moderationList .new .columnAvatar', $.proxy(this._dblclick, this));
		},
		
		/**
		 * Handles double clicks on avatar.
		 *
		 * @param        object                event
		 */
		_dblclick: function (event) {
			this._proxy.setOption('data', {
				actionName: 'markAsRead',
				className: 'wcf\\data\\moderation\\queue\\ModerationQueueAction',
				objectIDs: [$(event.currentTarget).parents('.moderationQueueEntry:eq(0)').data('queueID')]
			});
			this._proxy.sendRequest();
		},
		
		/**
		 * Handles successful AJAX requests.
		 *
		 * @param        object                data
		 * @param        string                textStatus
		 * @param        jQuery                jqXHR
		 */
		_success: function (data, textStatus, jqXHR) {
			$('.moderationList .new').each(function (index, element) {
				var $element = $(element);
				if (WCF.inArray($element.data('queueID'), data.objectIDs)) {
					// remove new class
					$element.removeClass('new');
					
					// remove event
					$element.find('.columnAvatar').off('dblclick');
				}
			});
		}
	});
	
	/**
	 * Marks all moderation queue entries as read.
	 * 
	 * @deprecated  6.0, use `WoltLabSuite/Core/Ui/Moderation/MarkAllAsRead` instead
	 */
	WCF.Moderation.Queue.MarkAllAsRead = Class.extend({
		/**
		 * action proxy
		 * @var        WCF.Action.Proxy
		 */
		_proxy: null,
		
		/**
		 * Initializes the WCF.Moderation.Queue.MarkAllAsRead class.
		 */
		init: function () {
			this._proxy = new WCF.Action.Proxy({
				success: $.proxy(this._success, this)
			});
			
			$('.markAllAsReadButton').click($.proxy(this._click, this));
		},
		
		/**
		 * Handles clicks.
		 *
		 * @param        object                event
		 */
		_click: function (event) {
			event.preventDefault();
			
			this._proxy.setOption('data', {
				actionName: 'markAllAsRead',
				className: 'wcf\\data\\moderation\\queue\\ModerationQueueAction'
			});
			this._proxy.sendRequest();
		},
		
		/**
		 * Marks all queue entries as read.
		 *
		 * @param        object                data
		 * @param        string                textStatus
		 * @param        jQuery                jqXHR
		 */
		_success: function (data, textStatus, jqXHR) {
			// remove badge in userpanel
			$('#outstandingModeration .badgeUpdate').remove();
			
			// fix moderation list
			var $moderationList = $('.moderationList');
			$moderationList.find('.new').removeClass('new');
			$moderationList.find('.columnAvatar').off('dblclick');
		}
	});
}
else {
	WCF.Moderation.Queue.MarkAsRead = Class.extend({
		_proxy: {},
		init: function() {},
		_dblclick: function() {},
		_success: function() {}
	});
	
	WCF.Moderation.Queue.MarkAllAsRead = Class.extend({
		_proxy: {},
		init: function() {},
		_click: function() {},
		_success: function() {}
	});
}

/**
 * Namespace for activation related classes.
 */
WCF.Moderation.Activation = { };

if (COMPILER_TARGET_DEFAULT) {
	/**
	 * Manages disabled content within moderation.
	 *
	 * @see        WCF.Moderation.Management
	 */
	WCF.Moderation.Activation.Management = WCF.Moderation.Management.extend({
		/**
		 * @see        WCF.Moderation.Management.init()
		 */
		init: function (queueID, redirectURL) {
			this._buttonSelector = '#enableContent, #removeContent';
			this._className = 'wcf\\data\\moderation\\queue\\ModerationQueueActivationAction';
			
			this._super(queueID, redirectURL, 'wcf.moderation.activation.{actionName}.confirmMessage');
		}
	});
}
else {
	WCF.Moderation.Activation.Management = WCF.Moderation.Management.extend({
		init: function() {},
		_buttonSelector: "",
		_className: "",
		_confirmationTemplate: {},
		_dialog: {},
		_languageItem: "",
		_proxy: {},
		_queueID: 0,
		_redirectURL: "",
		_click: function() {},
		_success: function() {},
	});
}

/**
 * Namespace for report related classes.
 */
WCF.Moderation.Report = { };

/**
 * Handles content report.
 * 
 * @param	string		objectType
 * @param	string		buttonSelector
 * @deprecated 6.0 Use the `data-report-content="com.example.foo"` attribute on a `<button>` instead.
 */
WCF.Moderation.Report.Content = Class.extend({
	/**
	 * list of buttons
	 * @var	object
	 */
	_buttons: { },
	
	/**
	 * button selector
	 * @var	string
	 */
	_buttonSelector: '',
	
	/**
	 * dialog overlay
	 * @var	jQuery
	 */
	_dialog: null,
	
	/**
	 * notification object
	 * @var	WCF.System.Notification
	 */
	_notification: null,
	
	/**
	 * object id
	 * @var	integer
	 */
	_objectID: 0,
	
	/**
	 * object type name
	 * @var	string
	 */
	_objectType: '',
	
	/**
	 * action proxy
	 * @var	WCF.Action.Proxy
	 */
	_proxy: null,
	
	/**
	 * Creates a new WCF.Moderation.Report object.
	 * 
	 * @param	string		objectType
	 * @param	string		buttonSelector
	 */
	init: function(objectType, buttonSelector) {
		this._objectType = objectType;
		this._buttonSelector = buttonSelector;
		
		this._buttons = { };
		this._notification = null;
		this._objectID = 0;
		this._proxy = new WCF.Action.Proxy({
			success: $.proxy(this._success, this)
		});
		
		this._initButtons();
		
		WCF.DOMNodeInsertedHandler.addCallback('WCF.Moderation.Report' + this._objectType.hashCode(), $.proxy(this._initButtons, this));
	},
	
	/**
	 * Initializes the report feature for all matching buttons.
	 */
	_initButtons: function() {
		var self = this;
		$(this._buttonSelector).each(function(index, button) {
			var $button = $(button);
			var $buttonID = $button.wcfIdentify();
			
			if (!self._buttons[$buttonID]) {
				self._buttons[$buttonID] = $button;
				$button.click($.proxy(self._click, self));
			}
		});
	},
	
	/**
	 * Handles clicks on a report button.
	 * 
	 * @param	object		event
	 */
	_click: function(event) {
		event.preventDefault();
		this._objectID = $(event.currentTarget).data('objectID');
		
		this._proxy.setOption('data', {
			actionName: 'prepareReport',
			className: 'wcf\\data\\moderation\\queue\\ModerationQueueReportAction',
			parameters: {
				objectID: this._objectID,
				objectType: this._objectType
			}
		});
		this._proxy.sendRequest();
	},
	
	/**
	 * Handles successful AJAX requests.
	 * 
	 * @param	object		data
	 * @param	string		textStatus
	 * @param	jQuery		jqXHR
	 */
	_success: function(data, textStatus, jqXHR) {
		// object has been successfully reported
		if (data.returnValues.reported) {
			if (this._notification === null) {
				this._notification = new WCF.System.Notification(WCF.Language.get('wcf.moderation.report.success'));
			}
			
			// show success and close dialog
			this._dialog.wcfDialog('close');
			this._notification.show();
		}
		else if (data.returnValues.template) {
			// display template
			this._showDialog(data.returnValues.template);
			
			if (!data.returnValues.alreadyReported) {
				// bind event listener for buttons
				this._dialog.find('.jsSubmitReport').click($.proxy(this._submit, this));
			}
		}
	},
	
	/**
	 * Displays the dialog overlay.
	 * 
	 * @param	string		template
	 */
	_showDialog: function(template) {
		if (this._dialog === null) {
			this._dialog = $('#moderationReport');
			if (!this._dialog.length) {
				this._dialog = $('<div id="moderationReport" />').hide().appendTo(document.body);
			}
		}
		
		this._dialog.html(template).wcfDialog({
			title: WCF.Language.get('wcf.moderation.report.reportContent')
		}).wcfDialog('render');
	},
	
	/**
	 * Submits a report unless the textarea is empty.
	 */
	_submit: function() {
		var $text = this._dialog.find('.jsReportMessage').val();
		if ($.trim($text) == '') {
			this._dialog.find('.section > dl').addClass('formError');
			
			if (!this._dialog.find('.innerError').length) {
				this._dialog.find('.jsReportMessage').after($('<small class="innerError">' + WCF.Language.get('wcf.global.form.error.empty') + "</small>"));
			}
			
			return;
		}
		
		this._proxy.setOption('data', {
			actionName: 'report',
			className: 'wcf\\data\\moderation\\queue\\ModerationQueueReportAction',
			parameters: {
				message: $text,
				objectID: this._objectID,
				objectType: this._objectType
			}
		});
		this._proxy.sendRequest();
	}
});

if (COMPILER_TARGET_DEFAULT) {
	/**
	 * Manages reported content within moderation.
	 *
	 * @see        WCF.Moderation.Management
	 */
	WCF.Moderation.Report.Management = WCF.Moderation.Management.extend({
		/**
		 * @see        WCF.Moderation.Management.init()
		 */
		init: function (queueID, redirectURL, isMarkedAsConfirmed) {
			this._buttonSelector = '#removeContent, #removeReport, #changeJustifiedStatus';
			this._className = 'wcf\\data\\moderation\\queue\\ModerationQueueReportAction';
			
			this._super(queueID, redirectURL, 'wcf.moderation.report.{actionName}.confirmMessage');
			
			this._confirmationTemplate.removeContent = $('<div class="section"><dl><dt><label for="message">' + WCF.Language.get('wcf.moderation.report.removeContent.reason') + '</label></dt><dd><textarea name="message" id="message" cols="40" rows="3" /></dd></dl></div>');
			this._confirmationTemplate.removeReport = $('<div class="section"><dl><dt></dt><dd><label><input type="checkbox" name="markAsJustified" id="markAsJustified" value="1"> ' + WCF.Language.get('wcf.moderation.report.removeReport.markAsJustified') + '</label></dd></dl></div>');
			this._confirmationTemplate.changeJustifiedStatus = $('<div class="section"><dl><dt></dt><dd><label><input type="checkbox" name="markAsJustified" id="markAsJustified" value="1"' + (isMarkedAsConfirmed ? ' checked="checked"' : '') + '> ' + WCF.Language.get('wcf.moderation.report.changeJustifiedStatus.markAsJustified') + '</label></dd></dl></div>');
		},

		/**
		 * @see        WCF.Moderation.Management._success()
		 */
		_success: function (data, textStatus, jqXHR) {
			if (data.actionName === 'changeJustifiedStatus') {
				var notification = new WCF.System.Notification();
				notification.show(() => {
					window.location.reload();
				});
			}
			else {
				this._super(data, textStatus, jqXHR);
			}
		}
	});
}
else {
	WCF.Moderation.Report.Management = WCF.Moderation.Management.extend({
		init: function() {},
		_buttonSelector: "",
		_className: "",
		_confirmationTemplate: {},
		_dialog: {},
		_languageItem: "",
		_proxy: {},
		_queueID: 0,
		_redirectURL: "",
		_click: function() {},
		_success: function() {},
	});
}

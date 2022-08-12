{foreach from=$packages item=$package}
	<tr class="jsPackageRow packageSearchResultRow">
		<td class="columnIcon">
			<a href="#" class="jsInstallPackage jsTooltip" data-confirm-message="{lang __encode=true}wcf.acp.package.install.confirmMessage{/lang}" data-package="{$package->package}" data-package-version="{$package->getAccessibleVersion()->packageVersion}" title="{lang}wcf.acp.package.button.installPackage{/lang}">{icon size=24 name='plus' type='solid'}</a>
		</td>
		<td class="columnText">
			<div class="packageSearchName">{$package->packageName} <span class="packageSearchVersion">{$package->getAccessibleVersion()->packageVersion}</span></div>
			<div class="packageSearchDescription small">{$package->packageDescription}</div>
			<span class="packageSearchPackage small">{$package->package}</span>
			{if $package->pluginStoreFileID}
				<span class="packageSearchPluginStorePage separatorLeft small"><a href="https://pluginstore.woltlab.com/file/{@$package->pluginStoreFileID}/" class="externalURL jsTooltip" title="{lang}wcf.acp.pluginStore.file.link{/lang}"{if EXTERNAL_LINK_TARGET_BLANK} target="_blank" rel="noopener"{/if}>{lang}wcf.acp.pluginStore.file{/lang}</a></span>
			{/if}
		</td>
		<td class="columnText small packageSearchAuthor{if $package->getUpdateServer()->isWoltLabUpdateServer()} packageSearchAuthorWoltlab{/if}" title="{$package->author}">{if $package->authorURL}<a href="{$package->authorURL}" class="externalURL"{if EXTERNAL_LINK_TARGET_BLANK} target="_blank" rel="noopener"{/if}>{$package->author|truncate:30}</a>{else}{$package->author|truncate:30}{/if}</td>
		<td class="columnText small packageSearchLicense" title="{$package->getAccessibleVersion()->license}">{if $package->getAccessibleVersion()->licenseURL}<a href="{$package->getAccessibleVersion()->licenseURL}" class="externalURL"{if EXTERNAL_LINK_TARGET_BLANK} target="_blank" rel="noopener"{/if}>{$package->getAccessibleVersion()->license|truncate:30}</a>{else}{$package->getAccessibleVersion()->license|truncate:30}{/if}</td>
		<td class="columnDate packageSearchDate">{@$package->getAccessibleVersion()->packageDate|time}</td>
	</tr>
{/foreach}

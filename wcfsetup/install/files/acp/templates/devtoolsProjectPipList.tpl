{include file='header' pageTitle='wcf.acp.devtools.project.pip.list.pageTitle'}

<header class="contentHeader">
	<div class="contentHeaderTitle">
		<h1 class="contentTitle">{lang}wcf.acp.devtools.project.pip.list{/lang}</h1>
		<p class="contentHeaderDescription">{$project->name}</p>
	</div>
	
	<nav class="contentHeaderNavigation">
		<ul>
			{if $project->validate() === ''}
				<li><a href="{link controller='DevtoolsProjectSync' id=$project->getObjectID()}{/link}" class="button">{icon name='arrows-rotate'} <span>{lang}wcf.acp.devtools.project.sync{/lang}</span></a></li>
			{/if}
			<li><a href="{link controller='DevtoolsProjectEdit' id=$project->getObjectID()}{/link}" class="button">{icon name='pencil'} <span>{lang}wcf.acp.devtools.project.edit{/lang}</span></a></li>
			<li><a href="{link controller='DevtoolsProjectList'}{/link}" class="button">{icon name='list'} <span>{lang}wcf.acp.menu.link.devtools.project.list{/lang}</span></a></li>
			
			{event name='contentHeaderNavigation'}
		</ul>
	</nav>
</header>

{if $project->validate() === ''}
	<div class="section">
		<dl>
			<dt></dt>
			<dd>
				<label><input type="checkbox" id="showOnlyMatches" checked> {lang}wcf.acp.devtools.pip.showOnlyMatches{/lang}</label>
				<small>{lang}wcf.acp.devtools.pip.showOnlyMatches.description{/lang}</small>
			</dd>
		</dl>
		<dl>
			<dt></dt>
			<dd>
				<label><input type="checkbox" id="showGuiSupportingPipsOnly" checked> {lang}wcf.acp.devtools.pip.showGuiSupportingPipsOnly{/lang}</label>
				<small>{lang}wcf.acp.devtools.pip.showGuiSupportingPipsOnly.description{/lang}</small>
			</dd>
		</dl>
	</div>
	
	<div class="section tabularBox jsShowOnlyMatches" id="projectPipList">
		<table class="table">
			<thead>
				<tr>
					<th class="columnText" colspan="2">{lang}wcf.acp.devtools.pip.pluginName{/lang}</th>
					<th class="columnText">{lang}wcf.acp.devtools.pip.defaultFilename{/lang}</th>
				</tr>
			</thead>
			
			<tbody>
				{foreach from=$project->getPips() item=pip}
					{if !$pip->supportsGui() || $pip->getPip()->getEntryTypes()|empty}
						<tr data-plugin-name="{$pip->pluginName}" data-is-supported="{if $pip->supportsGui()}true{else}false{/if}" data-is-used="{if !$pip->getTargets($project)|empty}true{else}false{/if}">
							<td class="columnIcon">
								{if $pip->supportsGui()}
									<a href="{link controller='DevtoolsProjectPipEntryAdd' id=$project->projectID pip=$pip->pluginName}{/link}" title="{lang}wcf.global.button.add{/lang}" class="jsTooltip">{icon name='plus'}</a>
									<a href="{link controller='DevtoolsProjectPipEntryList' id=$project->projectID pip=$pip->pluginName}{/link}" title="{lang}wcf.global.button.list{/lang}" class="jsTooltip">{icon name='list'}</a>
								{else}
									<span class="disabled" title="{lang}wcf.global.button.add{/lang}">
										{icon name='plus'}
									</span>
									<span class="disabled" title="{lang}wcf.global.button.list{/lang}">
										{icon name='list'}
									</span>
								{/if}
							</td>
							<td class="columnText">
								{if $pip->supportsGui()}
									<a href="{link controller='DevtoolsProjectPipEntryList' id=$project->projectID pip=$pip->pluginName}{/link}">{$pip->pluginName}</a>
								{else}
									{$pip->pluginName}
								{/if}
							</td>
							{if $pip->supportsGui()}
								<td class="columnText pipDefaultFilename"><small>{$pip->getEffectiveDefaultFilename()}</small></td>
							{else}
								<td class="columnText" colspan="3">
									{if !$pip->isSupported()}
										{$pip->getFirstError()}
									{elseif !$pip->supportsGui()}
										{lang}wcf.acp.devtools.pip.error.noGuiSupport{/lang}
									{/if}
								</td>
							{/if}
						</tr>
					{else}
						{foreach from=$pip->getPip()->getEntryTypes() item=entryType}
							<tr data-plugin-name="{$pip->pluginName}" data-is-supported="true" data-is-used="{if !$pip->getTargets($project)|empty}true{else}false{/if}">
								<td class="columnIcon">
									<a href="{link controller='DevtoolsProjectPipEntryAdd' id=$project->projectID pip=$pip->pluginName entryType=$entryType}{/link}" title="{lang}wcf.global.button.add{/lang}" class="jsTooltip">{icon name='plus'}</a>
									<a href="{link controller='DevtoolsProjectPipEntryList' id=$project->projectID pip=$pip->pluginName entryType=$entryType}{/link}" title="{lang}wcf.global.button.list{/lang}" class="jsTooltip">{icon name='list'}</a>
								</td>
								<td class="columnText">
									<a href="{link controller='DevtoolsProjectPipEntryList' id=$project->projectID pip=$pip->pluginName entryType=$entryType}{/link}">{$pip->pluginName} ({$entryType})</a>
								</td>
								<td class="columnText pipDefaultFilename"><small>{$pip->getEffectiveDefaultFilename()}</small></td>
							</tr>
						{/foreach}
					{/if}
				{/foreach}
			</tbody>
		</table>
	</div>
	
	<woltlab-core-notice type="info" style="display: none;">{lang}wcf.global.noItems{/lang}</woltlab-core-notice>
{else}
	<woltlab-core-notice type="error">{@$project->validate()}</woltlab-core-notice>
{/if}

<script data-relocate="true">
	var showOnlyMatches = elById('showOnlyMatches');
	var showGuiSupportingPipsOnly = elById('showGuiSupportingPipsOnly');
	
	function updateDisplayedPips() {
		var pipList = elById('projectPipList');
		var hasVisiblePips = false;
		
		elBySelAll('tbody > tr', pipList, function(element) {
			if (showOnlyMatches.checked && !elDataBool(element, 'is-used')) {
				elHide(element);
			}
			else if (showGuiSupportingPipsOnly.checked && !elDataBool(element, 'is-supported')) {
				elHide(element);
			}
			else {
				hasVisiblePips = true;
				elShow(element);
			}
		});
		
		var info = pipList.nextElementSibling;
		if (hasVisiblePips) {
			elShow(pipList);
			elHide(info);
		}
		else {
			elHide(pipList);
			elShow(info);
		}
	}
	
	showOnlyMatches.addEventListener('change', updateDisplayedPips);
	showGuiSupportingPipsOnly.addEventListener('change', updateDisplayedPips);
	
	updateDisplayedPips();
</script>

{include file='__devtoolsProjectInstallationJavaScript'}
{include file='footer'}

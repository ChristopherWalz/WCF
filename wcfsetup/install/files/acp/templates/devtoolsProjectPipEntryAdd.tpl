{include file='header' pageTitle='wcf.acp.devtools.project.pip.entry.'|concat:$action:'.pageTitle'}

<header class="contentHeader">
	<div class="contentHeaderTitle">
		<h1 class="contentTitle">{lang}wcf.acp.devtools.project.pip.entry.{$action}{/lang}</h1>
		<p class="contentHeaderDescription">{$project->name}</p>
	</div>
	
	<nav class="contentHeaderNavigation">
		<ul>
			<li><a href="{link controller='DevtoolsProjectPipEntryList' id=$project->projectID pip=$pip entryType=$entryType}{/link}" class="button">{icon name='list'} <span>{lang}wcf.acp.devtools.project.pip.entry.list{/lang}</span></a></li>
			<li><a href="{link controller='DevtoolsProjectList'}{/link}" class="button">{icon name='list'} <span>{lang}wcf.acp.menu.link.devtools.project.list{/lang}</span></a></li>
			
			{event name='contentHeaderNavigation'}
		</ul>
	</nav>
</header>

{@$pipObject->getPip()->getAdditionalTemplateCode()}

{@$form->getHtml()}

{include file='footer'}

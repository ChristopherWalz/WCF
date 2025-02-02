{capture assign='pageTitle'}{lang}wcf.moderation.deletedContent.{@$objectType}{/lang}{/capture}

{capture assign='sidebarRight'}
	<section class="box" data-static-box-identifier="com.woltlab.wcf.DeletedContentListMenu">
		<h2 class="boxTitle">{lang}wcf.moderation.deletedContent.objectTypes{/lang}</h2>
		
		<div class="boxContent">
			<nav>
				<ul class="boxMenu">
					{foreach from=$availableObjectTypes item=availableObjectType}
						<li{if $objectType == $availableObjectType->objectType} class="active"{/if}><a class="boxMenuLink" href="{link controller='DeletedContentList'}objectType={@$availableObjectType->objectType}{/link}">{lang}wcf.moderation.deletedContent.objectType.{@$availableObjectType->objectType}{/lang}</a></li>
					{/foreach}
				</ul>
			</nav>
		</div>
	</section>
{/capture}

{capture assign='contentTitle'}{lang}wcf.moderation.deletedContent.{@$objectType}{/lang}{/capture}

{capture assign='contentInteractionPagination'}
	{pages print=true assign=pagesLinks controller='DeletedContentList' link="objectType=$objectType&pageNo=%d"}
{/capture}

{include file='header'}

{if $items}
	{include file=$resultListTemplateName application=$resultListApplication}
{else}
	<p class="info" role="status">{lang}wcf.global.noItems{/lang}</p>
{/if}

<footer class="contentFooter">
	{hascontent}
		<div class="paginationBottom">
			{content}{@$pagesLinks}{/content}
		</div>
	{/hascontent}
	
	{hascontent}
		<nav class="contentFooterNavigation">
			<ul>
				{content}{event name='contentFooterNavigation'}{/content}
			</ul>
		</nav>
	{/hascontent}
</footer>

{include file='footer'}

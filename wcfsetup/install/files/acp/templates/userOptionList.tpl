{include file='header' pageTitle='wcf.acp.user.option.list'}

<header class="contentHeader">
	<div class="contentHeaderTitle">
		<h1 class="contentTitle">{lang}wcf.acp.user.option.list{/lang} <span class="badge badgeInverse">{#$items}</span></h1>
	</div>
	
	<nav class="contentHeaderNavigation">
		<ul>
			<li><a href="{link controller='UserOptionAdd'}{/link}" class="button">{icon name='plus'} <span>{lang}wcf.acp.user.option.add{/lang}</span></a></li>
			
			{event name='contentHeaderNavigation'}
		</ul>
	</nav>
</header>

{hascontent}
	<div class="paginationTop">
		{content}{pages print=true assign=pagesLinks controller="UserOptionList" link="pageNo=%d&sortField=$sortField&sortOrder=$sortOrder"}{/content}
	</div>
{/hascontent}

{if $objects|count}
	<div class="section tabularBox">
		<table class="table jsObjectActionContainer" data-object-action-class-name="wcf\data\user\option\UserOptionAction">
			<thead>
				<tr>
					<th class="columnID columnOptionID{if $sortField == 'optionID'} active {@$sortOrder}{/if}" colspan="2"><a href="{link controller='UserOptionList'}pageNo={@$pageNo}&sortField=optionID&sortOrder={if $sortField == 'optionID' && $sortOrder == 'ASC'}DESC{else}ASC{/if}{/link}">{lang}wcf.global.objectID{/lang}</a></th>
					<th class="columnTitle columnOptionName{if $sortField == 'optionName'} active {@$sortOrder}{/if}"><a href="{link controller='UserOptionList'}pageNo={@$pageNo}&sortField=optionName&sortOrder={if $sortField == 'optionName' && $sortOrder == 'ASC'}DESC{else}ASC{/if}{/link}">{lang}wcf.global.name{/lang}</a></th>
					<th class="columnText columnCategoryName{if $sortField == 'categoryName'} active {@$sortOrder}{/if}"><a href="{link controller='UserOptionList'}pageNo={@$pageNo}&sortField=categoryName&sortOrder={if $sortField == 'categoryName' && $sortOrder == 'ASC'}DESC{else}ASC{/if}{/link}">{lang}wcf.acp.user.option.categoryName{/lang}</a></th>
					<th class="columnText columnOptionType{if $sortField == 'optionType'} active {@$sortOrder}{/if}"><a href="{link controller='UserOptionList'}pageNo={@$pageNo}&sortField=optionType&sortOrder={if $sortField == 'optionType' && $sortOrder == 'ASC'}DESC{else}ASC{/if}{/link}">{lang}wcf.acp.user.option.optionType{/lang}</a></th>
					<th class="columnDigits columnShowOrder{if $sortField == 'showOrder'} active {@$sortOrder}{/if}"><a href="{link controller='UserOptionList'}pageNo={@$pageNo}&sortField=showOrder&sortOrder={if $sortField == 'showOrder' && $sortOrder == 'ASC'}DESC{else}ASC{/if}{/link}">{lang}wcf.global.showOrder{/lang}</a></th>
					
					{event name='columnHeads'}
				</tr>
			</thead>
			
			<tbody class="jsReloadPageWhenEmpty">
				{foreach from=$objects item=option}
					<tr class="jsOptionRow jsObjectActionObject" data-object-id="{@$option->getObjectID()}">
						<td class="columnIcon">
							{objectAction action="toggle" isDisabled=$option->isDisabled}
							<a href="{link controller='UserOptionEdit' id=$option->optionID}{/link}" title="{lang}wcf.global.button.edit{/lang}" class="jsTooltip">{icon name='pencil'}</a>
							{if $option->canDelete()}
								{objectAction action="delete" objectTitle=$option->getTitle()}
							{else}
								<span class="disabled" title="{lang}wcf.global.button.delete{/lang}">
									{icon name='xmark'}
								</span>
							{/if}
							
							{event name='rowButtons'}
						</td>
						<td class="columnID">{@$option->optionID}</td>
						<td class="columnTitle columnOptionName"><a href="{link controller='UserOptionEdit' id=$option->optionID}{/link}">{$option->getTitle()}</a></td>
						<td class="columnText columnCategoryName">{lang}wcf.user.option.category.{$option->categoryName}{/lang}</td>
						<td class="columnText columnOptionType">{$option->optionType}</td>
						<td class="columnDigits columnShowOrder">{#$option->showOrder}</td>
						
						{event name='columns'}
					</tr>
				{/foreach}
			</tbody>
		</table>
	</div>
	
	<footer class="contentFooter">
		{hascontent}
			<div class="paginationBottom">
				{content}{@$pagesLinks}{/content}
			</div>
		{/hascontent}
		
		<nav class="contentFooterNavigation">
			<ul>
				<li><a href="{link controller='UserOptionAdd'}{/link}" class="button">{icon name='plus'} <span>{lang}wcf.acp.user.option.add{/lang}</span></a></li>
				
				{event name='contentFooterNavigation'}
			</ul>
		</nav>
	</footer>
{else}
	<p class="info">{lang}wcf.global.noItems{/lang}</p>
{/if}

{include file='footer'}

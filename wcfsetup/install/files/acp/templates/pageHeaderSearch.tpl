<a href="#" id="pageHeaderSearchMobile" class="pageHeaderSearchMobile" role="button" tabindex="0" aria-expanded="false" aria-label="{lang}wcf.global.search{/lang}">
	<span class="icon icon32 fa-search" aria-hidden="true"></span>
</a>

<div id="pageHeaderSearch" class="pageHeaderSearch" data-disable-auto-focus="true">
	<div class="pageHeaderSearchInputContainer">
		<div id="pageHeaderSearchType" class="pageHeaderSearchType dropdown">
			<a href="#" class="button dropdownToggle" id="pageHeaderSearchTypeSelect"><span class="pageHeaderSearchTypeLabel">{lang}wcf.search.type.everywhere{/lang}</span></a>
			<ul class="dropdownMenu">
				<li><a href="#" data-provider-name="everywhere">{lang}wcf.search.type.everywhere{/lang}</a></li>
				<li class="dropdownDivider"></li>
				
				{foreach from=$availableAcpSearchProviders key='availableAcpSearchProviderName' item='availableAcpSearchProviderLabel'}
					<li><a href="#" data-provider-name="{@$availableAcpSearchProviderName}">{@$availableAcpSearchProviderLabel}</a></li>
				{/foreach}
			</ul>
		</div>
		
		<input type="search" name="q" id="pageHeaderSearchInput" class="pageHeaderSearchInput" placeholder="{lang}wcf.global.search.enterSearchTerm{/lang}" autocomplete="off" required value="" data-toggle="search">
		
		<button class="button pageHeaderSearchInputButton" type="submit">
			<span class="icon icon16 pointer fa-search" title="{lang}wcf.global.search{/lang}"></span>
		</button>
	</div>
</div>

<div
	id="pageHeaderLogo"
	class="
		pageHeaderLogo
		{if ENABLE_DEBUG_MODE} pageHeaderLogo--debug{/if}
		{if ENABLE_DEVELOPER_TOOLS} pageHeaderLogo--dev{/if}
	"
>
	<a href="{link}{/link}">
		<img src="{@$__wcf->getPath()}acp/images/woltlabSuite.png" alt="" width="562" height="80" loading="eager" class="pageHeaderLogoLarge">
		<img src="{@$__wcf->getPath()}acp/images/woltlabSuite-small.png" alt="" width="55" height="30" loading="eager" class="pageHeaderLogoSmall">
	</a>
</div>
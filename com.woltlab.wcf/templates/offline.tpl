{include file='header' skipBreadcrumbs=true}

<div class="warning" role="status">
	<p><strong>{lang}wcf.page.offline{/lang}</strong></p>
	<p>{if OFFLINE_MESSAGE_ALLOW_HTML}{@OFFLINE_MESSAGE|phrase}{else}{@OFFLINE_MESSAGE|phrase|newlineToBreak}{/if}</p>
</div>

{include file='footer'}

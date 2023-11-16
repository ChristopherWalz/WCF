<div>
	<woltlab-core-notice type="warning">{lang}wcf.acp.content.provider.removeContentWarning{/lang}</woltlab-core-notice>
	
	<div class="section">
		<header class="sectionHeader">
			<h2 class="sectionTitle">{lang}wcf.acp.content.provider.removeContentSectionTitle{/lang}</h2>
			<p class="sectionDescription">{lang}wcf.acp.content.provider.removeContentInfo{/lang}</p>
		</header>
		
		<dl>
			<dt></dt>
			<dd>
				{foreach from=$knownContentProvider item=contentProvider}
					<label><input class="contentProviderObjectType" type="checkbox" name="{$contentProvider}" checked> {lang}wcf.acp.content.provider.{$contentProvider}{/lang}</label>
				{/foreach}
			</dd>
		</dl>
	</div>
		
	<div class="formSubmit">
		<input type="submit" value="{lang}wcf.global.button.submit{/lang}" accesskey="s">
	</div>
</div>

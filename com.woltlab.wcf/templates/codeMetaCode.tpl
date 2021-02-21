<div class="codeBox collapsibleBbcode jsCollapsibleBbcode {if $lines > 10} collapsed{/if}">
	<div class="codeBoxHeader">
		<div class="codeBoxHeadline">{$title}{if $filename}: {$filename}{/if}</div>
		
		{if !$isAmp && $lines > 10}
			<span class="toggleButton icon icon24 fa-expand jsTooltip pointer" title="{lang}wcf.bbcode.button.showAll{/lang}" data-title-collapse="{lang}wcf.bbcode.button.collapse{/lang}" data-title-expand="{lang}wcf.bbcode.button.showAll{/lang}" role="button" tabindex="0"></span>
		{/if}
	</div>
	
	{assign var='lineNumber' value=$startLineNumber}
	<pre class="codeBoxCode collapsibleBbcodeOverflow"><code{if $language} class="language-{$language}"{/if}>{foreach from=$content item=line}{*
		*}{assign var='codeLineID' value='codeLine_'|concat:$lineNumber:'_':$codeID}{*
		*}<span class="codeBoxLine" id="{$codeLineID}"><a href="{@$__wcf->getAnchor($codeLineID)}" class="lineAnchor" title="{@$lineNumber}" tabindex="-1" aria-hidden="true"></a><span>{$line}</span></span>{*
		*}{assign var='lineNumber' value=$lineNumber+1}{*
	*}{/foreach}</code></pre>
	
	{if !$isAmp && $lines > 10}
		<span class="toggleButton" data-title-collapse="{lang}wcf.bbcode.button.collapse{/lang}" data-title-expand="{lang}wcf.bbcode.button.showAll{/lang}">{lang}wcf.bbcode.button.showAll{/lang}</span>
	{/if}
</div>
{if !$isAmp}
	<script data-relocate="true">
		require(['Language', 'WoltLabSuite/Core/Bbcode/Collapsible', 'WoltLabSuite/Core/Bbcode/Code'], function (Language, BbcodeCollapsible, BbcodeCode) {
			Language.addObject({
				'wcf.message.bbcode.code.copy': '{jslang}wcf.message.bbcode.code.copy{/jslang}',
				'wcf.message.bbcode.code.copy.success': '{jslang}wcf.message.bbcode.code.copy.success{/jslang}'
			});
			BbcodeCollapsible.observe();
			BbcodeCode.processAll();
		});
	</script>
{/if}

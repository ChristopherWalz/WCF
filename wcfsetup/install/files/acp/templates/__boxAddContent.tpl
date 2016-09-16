{if $boxType == 'text'}
	<textarea name="content[{@$languageID}]" id="content{@$languageID}"
		{if $boxType == 'text'}
			class="wysiwygTextarea" data-autosave="com.woltlab.wcf.box{$action|ucfirst}-{if $action == 'edit'}{@$boxID}{else}0{/if}-{@$languageID}"
		{/if}
	>{if !$content[$languageID]|empty}{$content[$languageID]}{/if}</textarea>
	{include file='wysiwyg' wysiwygSelector='content'|concat:$languageID}
{else}
	<div dir="ltr">
		<textarea name="content[{@$languageID}]" id="content{@$languageID}"
			{if $boxType == 'text'}
				class="wysiwygTextarea" data-autosave="com.woltlab.wcf.box{$action|ucfirst}-{if $action == 'edit'}{@$boxID}{else}0{/if}-{@$languageID}"
			{/if}
		>{if !$content[$languageID]|empty}{$content[$languageID]}{/if}</textarea>
	</div>
	{if $boxType == 'html'}
		{include file='codemirror' codemirrorMode='htmlmixed' codemirrorSelector='#content'|concat:$languageID}
	{elseif $boxType == 'tpl'}
		{include file='codemirror' codemirrorMode='smartymixed' codemirrorSelector='#content'|concat:$languageID}
	{/if}
{/if}

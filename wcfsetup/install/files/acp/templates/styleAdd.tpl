{include file='header' pageTitle='wcf.acp.style.'|concat:$action}

{js application='wcf' acp='true' file='WCF.ACP.Style'}
{js application='wcf' file='WCF.ColorPicker' bundle='WCF.Combined'}
<script data-relocate="true">
	require(['WoltLab/WCF/Acp/Ui/Style/Editor'], function(AcpUiStyleEditor) {
		AcpUiStyleEditor.setup({
			isTainted: {if $isTainted}true{else}false{/if},
			styleId: {if $action === 'edit'}{@$style->styleID}{else}0{/if}
		});
	});
	
	$(function() {
		new WCF.ColorPicker('.jsColorPicker');
		
		WCF.Language.addObject({
			'wcf.style.colorPicker': '{lang}wcf.style.colorPicker{/lang}',
			'wcf.style.colorPicker.new': '{lang}wcf.style.colorPicker.new{/lang}',
			'wcf.style.colorPicker.current': '{lang}wcf.style.colorPicker.current{/lang}',
			'wcf.style.colorPicker.button.apply': '{lang}wcf.style.colorPicker.button.apply{/lang}',
			'wcf.acp.style.image.error.invalidExtension': '{lang}wcf.acp.style.image.error.invalidExtension{/lang}'
		});
		new WCF.ACP.Style.ImageUpload({if $action == 'add'}0{else}{@$style->styleID}{/if}, '{$tmpHash}');
		new WCF.ACP.Style.LogoUpload('{$tmpHash}', '{@$__wcf->getPath()}images/');
		
		{if $action == 'edit'}
			new WCF.ACP.Style.CopyStyle({@$style->styleID});
			
			WCF.Language.addObject({
				'wcf.acp.style.copyStyle.confirmMessage': '{@"wcf.acp.style.copyStyle.confirmMessage"|language|encodeJS}'
			});
		{/if}
		
		$('.jsUnitSelect').change(function(event) {
			var $target = $(event.currentTarget);
			$target.prev().attr('step', ($target.val() == 'em' ? '0.01' : '1'));
		}).trigger('change');
	});
</script>
<header class="boxHeadline">
	<h1>{lang}wcf.acp.style.{$action}{/lang}</h1>
	{if $action == 'edit'}<p>{$styleName}</p>{/if}
</header>

{include file='formError'}

{if $success|isset}
	<p class="success">{lang}wcf.global.success.{$action}{/lang}</p>
{/if}

<div class="contentNavigation">
	<nav>
		<ul>
			{if $action == 'edit'}
				<li><a href="{link controller='StyleExport' id=$style->styleID}{/link}" class="button"><span class="icon icon16 icon-download-alt"></span> <span>{lang}wcf.acp.style.exportStyle{/lang}</span></a></li>
				<li><a class="jsCopyStyle button"><span class="icon icon16 icon-copy"></span> <span>{lang}wcf.acp.style.copyStyle{/lang}</span></a></li>
			{/if}
			
			<li><a href="{link controller='StyleList'}{/link}" class="button"><span class="icon icon16 icon-list"></span> <span>{lang}wcf.acp.menu.link.style.list{/lang}</span></a></li>
			
			{event name='contentNavigationButtons'}
		</ul>
	</nav>
</div>

<form method="post" action="{if $action == 'add'}{link controller='StyleAdd'}{/link}{else}{link controller='StyleEdit' id=$styleID}{/link}{/if}">
	<div class="tabMenuContainer" data-active="{$activeTabMenuItem}" data-store="activeTabMenuItem" id="styleTabMenuContainer">
		<nav class="tabMenu">
			<ul>
				<li><a href="{@$__wcf->getAnchor('general')}">{lang}wcf.acp.style.general{/lang}</a></li>
				<li><a href="{@$__wcf->getAnchor('globals')}">{lang}wcf.acp.style.globals{/lang}</a></li>
				<li><a href="{@$__wcf->getAnchor('colors')}">{lang}wcf.acp.style.colors{/lang}</a></li>
				<li><a href="{@$__wcf->getAnchor('advanced')}">{lang}wcf.acp.style.advanced{/lang}</a></li>
				
				{event name='tabMenuTabs'}
			</ul>
		</nav>
		
		{* general *}
		<div id="general" class="container containerPadding tabMenuContent">
			<p class="info">{lang}wcf.acp.style.protected{/lang}</p>
			
			<fieldset class="marginTop">
				<legend>{lang}wcf.acp.style.general.data{/lang}</legend>
				
				<dl{if $errorField == 'styleName'} class="formError"{/if}>
					<dt><label for="styleName">{lang}wcf.acp.style.styleName{/lang}</label></dt>
					<dd>
						<input type="text" name="styleName" id="styleName" value="{$styleName}" class="long" />
						{if $errorField == 'styleName'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.styleName.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'authorName'} class="formError"{/if}>
					<dt><label for="authorName">{lang}wcf.acp.style.authorName{/lang}</label></dt>
					<dd>
						<input type="text" name="authorName" id="authorName" value="{$authorName}" class="long"{if !$isTainted} readonly{/if} />
						{if $errorField == 'authorName'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.authorName.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'copyright'} class="formError"{/if}>
					<dt><label for="copyright">{lang}wcf.acp.style.copyright{/lang}</label></dt>
					<dd>
						<input type="text" name="copyright" id="copyright" value="{$copyright}" class="long"{if !$isTainted} readonly{/if} />
						{if $errorField == 'copyright'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.copyright.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'styleVersion'} class="formError"{/if}>
					<dt><label for="styleVersion">{lang}wcf.acp.style.styleVersion{/lang}</label></dt>
					<dd>
						<input type="text" name="styleVersion" id="styleVersion" value="{$styleVersion}" class="small"{if !$isTainted} readonly{/if} />
						{if $errorField == 'styleVersion'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.styleVersion.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'styleDate'} class="formError"{/if}>
					<dt><label for="styleDate">{lang}wcf.acp.style.styleDate{/lang}</label></dt>
					<dd>
						<input type="date" name="styleDate" id="styleDate" value="{$styleDate}" class="small"{if !$isTainted} readonly{/if} />
						{if $errorField == 'styleDate'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.styleDate.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'license'} class="formError"{/if}>
					<dt><label for="license">{lang}wcf.acp.style.license{/lang}</label></dt>
					<dd>
						<input type="text" name="license" id="license" value="{$license}" class="long"{if !$isTainted} readonly{/if} />
						{if $errorField == 'license'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.license.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'authorURL'} class="formError"{/if}>
					<dt><label for="authorURL">{lang}wcf.acp.style.authorURL{/lang}</label></dt>
					<dd>
						<input type="text" name="authorURL" id="authorURL" value="{$authorURL}" class="long"{if !$isTainted} readonly{/if} />
						{if $errorField == 'authorURL'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.authorURL.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'packageName'} class="formError"{/if}>
					<dt><label for="packageName">{lang}wcf.acp.style.packageName{/lang}</label></dt>
					<dd>
						<input type="text" name="packageName" id="packageName" value="{$packageName}" class="long"{if !$isTainted} readonly{/if} />
						{if $errorField == 'packageName'}
							<small class="innerError">{lang}wcf.acp.style.packageName.error.{$errorType}{/lang}</small>
						{/if}
					</dd>
				</dl>
				<dl{if $errorField == 'styleDescription'} class="formError"{/if}>
					<dt><label for="styleDescription">{lang}wcf.acp.style.styleDescription{/lang}</label></dt>
					<dd>
						<textarea name="styleDescription" id="styleDescription">{$i18nPlainValues['styleDescription']}</textarea>
						{if $errorField == 'styleDescription'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.styleDescription.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
						
						{include file='multipleLanguageInputJavascript' elementIdentifier='styleDescription' forceSelection=true}
					</dd>
				</dl>
				
				{event name='dataFields'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.general.files{/lang}</legend>
				
				<dl{if $errorField == 'image'} class="formError"{/if}>
					<dt><label for="image">{lang}wcf.acp.style.image{/lang}</label></dt>
					<dd class="framed">
						<img src="{if $action == 'add'}{@$__wcf->getPath()}images/stylePreview.png{else}{@$style->getPreviewImage()}{/if}" alt="" id="styleImage" />
						<div id="uploadImage"></div>
						{if $errorField == 'image'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.image.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
						<small>{lang}wcf.acp.style.image.description{/lang}</small>
					</dd>
				</dl>
				{if $availableTemplateGroups|count}
					<dl{if $errorField == 'templateGroupID'} class="formError"{/if}>
						<dt><label for="templateGroupID">{lang}wcf.acp.style.templateGroupID{/lang}</label></dt>
						<dd>
							<select name="templateGroupID" id="templateGroupID">
								<option value="0">{lang}wcf.acp.template.group.default{/lang}</option>
								{foreach from=$availableTemplateGroups item=templateGroup}
									<option value="{@$templateGroup->templateGroupID}"{if $templateGroup->templateGroupID == $templateGroupID} selected="selected"{/if}>{$templateGroup->templateGroupName}</option>
								{/foreach}
							</select>
							{if $errorField == 'templateGroupID'}
								<small class="innerError">
									{if $errorType == 'empty'}
										{lang}wcf.global.form.error.empty{/lang}
									{else}
										{lang}wcf.acp.style.templateGroupID.error.{$errorType}{/lang}
									{/if}
								</small>
							{/if}
						</dd>
					</dl>
				{/if}
				<dl{if $errorField == 'imagePath'} class="formError"{/if}>
					<dt><label for="imagePath">{lang}wcf.acp.style.imagePath{/lang}</label></dt>
					<dd>
						<input type="text" name="imagePath" id="imagePath" value="{$imagePath}" class="long" />
						{if $errorField == 'imagePath'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.imagePath.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
						<small>{lang}wcf.acp.style.imagePath.description{/lang}</small>
					</dd>
				</dl>
				
				{event name='fileFields'}
			</fieldset>
			
			{event name='generalFieldsets'}
		</div>
		
		{* globals *}
		<div id="globals" class="container containerPadding tabMenuContent">
			{* layout *}
			<fieldset>
				<legend>{lang}wcf.acp.style.globals.layout{/lang}</legend>
				
				<dl>
					<dt></dt>
					<dd><label>
						<input type="checkbox" id="useFluidLayout" name="useFluidLayout" value="1"{if $variables[useFluidLayout]} checked="checked"{/if} />
						<span>{lang}wcf.acp.style.globals.useFluidLayout{/lang}</span>
					</label></dd>
				</dl>
				
				<dl id="fluidLayoutMinWidth">
					<dt><label for="wcfLayoutMinWidth">{lang}wcf.acp.style.globals.fluidLayoutMinWidth{/lang}</label></dt>
					<dd>
						<input type="number" id="wcfLayoutMinWidth" name="wcfLayoutMinWidth" value="{@$variables[wcfLayoutMinWidth]}" class="tiny" />
						<select name="wcfLayoutMinWidth_unit" class="jsUnitSelect">
							{foreach from=$availableUnits item=unit}
								<option value="{@$unit}"{if $variables[wcfLayoutMinWidth_unit] == $unit} selected="selected"{/if}>{@$unit}</option>
							{/foreach}
						</select>
					</dd>
				</dl>
				<dl id="fluidLayoutMaxWidth">
					<dt><label for="wcfLayoutMaxWidth">{lang}wcf.acp.style.globals.fluidLayoutMaxWidth{/lang}</label></dt>
					<dd>
						<input type="number" id="wcfLayoutMaxWidth" name="wcfLayoutMaxWidth" value="{@$variables[wcfLayoutMaxWidth]}" class="tiny" />
						<select name="wcfLayoutMaxWidth_unit" class="jsUnitSelect">
							{foreach from=$availableUnits item=unit}
								<option value="{@$unit}"{if $variables[wcfLayoutMaxWidth_unit] == $unit} selected="selected"{/if}>{@$unit}</option>
							{/foreach}
						</select>
					</dd>
				</dl>
				
				<dl id="fixedLayoutVariables">
					<dt><label for="wcfLayoutFixedWidth">{lang}wcf.acp.style.globals.fixedLayoutWidth{/lang}</label></dt>
					<dd>
						<input type="number" id="wcfLayoutFixedWidth" name="wcfLayoutFixedWidth" value="{@$variables[wcfLayoutFixedWidth]}" class="tiny" />
						<select name="wcfLayoutFixedWidth_unit" class="jsUnitSelect">
							{foreach from=$availableUnits item=unit}
								<option value="{@$unit}"{if $variables[wcfLayoutFixedWidth_unit] == $unit} selected="selected"{/if}>{@$unit}</option>
							{/foreach}
						</select>
					</dd>
				</dl>
				
				{event name='layoutFields'}
			</fieldset>
			
			{* logo *}
			<fieldset>
				<legend>{lang}wcf.acp.style.globals.pageLogo{/lang}</legend>
				
				<dl>
					<dt><label for="pageLogo">{lang}wcf.acp.style.globals.pageLogo{/lang}</label></dt>
					<dd class="framed">
						<img src="" alt="" id="styleLogo" style="max-width: 100%" />
						<div id="uploadLogo"></div>
						{if $errorField == 'image'}
							<small class="innerError">
								{if $errorType == 'empty'}
									{lang}wcf.global.form.error.empty{/lang}
								{else}
									{lang}wcf.acp.style.image.error.{$errorType}{/lang}
								{/if}
							</small>
						{/if}
					</dd>
					<dd>
						<input type="text" name="pageLogo" id="pageLogo" value="{$variables[pageLogo]}" class="long" />
						<small>{lang}wcf.acp.style.globals.pageLogo.description{/lang}</small>
					</dd>
				</dl>
				
				{event name='logoFields'}
			</fieldset>
			
			{* font *}
			<fieldset>
				<legend>{lang}wcf.acp.style.globals.font{/lang}</legend>
				
				<dl>
					<dt><label for="wcfBaseFontSize">{lang}wcf.acp.style.globals.fontSize{/lang}</label></dt>
					<dd>
						<input type="number" id="wcfBaseFontSize" name="wcfBaseFontSize" value="{@$variables[wcfBaseFontSize]}" class="tiny" />
						<select name="wcfBaseFontSize_unit" class="jsUnitSelect">
							{foreach from=$availableUnits item=unit}
								<option value="{@$unit}"{if $variables[wcfBaseFontSize_unit] == $unit} selected="selected"{/if}>{@$unit}</option>
							{/foreach}
						</select>
					</dd>
				</dl>
				<dl>
					<dt><label for="wcfBaseFontFamily">{lang}wcf.acp.style.globals.fontFamily{/lang}</label></dt>
					<dd>
						<select name="wcfBaseFontFamily" id="wcfBaseFontFamily">
							{foreach from=$availableFontFamilies key=fontFamily item=primaryFont}
								<option value='{@$fontFamily}'{if $variables[wcfBaseFontFamily] == $fontFamily} selected="selected"{/if}>{@$primaryFont}</option>
							{/foreach}
						</select>
					</dd>
				</dl>
				
				{event name='fontFields'}
			</fieldset>
			
			{event name='globalFieldsets'}
		</div>
		
		{* colors *}
		<div id="colors" class="container containerPadding tabMenuContent">
			{foreach from=$colors key=itemPrefix item=items}
				<section>
					<h1>{$itemPrefix}</h1>
					
					{foreach from=$items item=colorItems}
						<ul class="colorList">
							{foreach from=$colorItems[items] item=colorItem}
								{capture assign=variableName}{if $colorItems[overridePrefix]|isset}{@$colorItems[overridePrefix]}{else}{@$itemPrefix}{/if}{@$colorItem|ucfirst}{/capture}
								
								<li>{include file='styleVariableColor' variableName=$variableName languageVariable=$colorItem}</li>
							{/foreach}
						</ul>
					{/foreach}
				</section>
			{/foreach}
			{*
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.page{/lang}</legend>
				
				{* page *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfPageBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfPageColor' languageVariable='color'}</li>
					<li>{include file='styleVariableColor' variableName='wcfPageLinkColor' languageVariable='linkColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfPageLinkHoverColor' languageVariable='linkHoverColor'}</li>
					
					{event name='pageColorListItems'}
				</ul>
				
				{event name='pageColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.content{/lang}</legend>
				
				{* content *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfContentBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfColor' languageVariable='color'}</li>
					<li>{include file='styleVariableColor' variableName='wcfDimmedColor' languageVariable='dimmedColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfLinkColor' languageVariable='linkColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfLinkHoverColor' languageVariable='linkHoverColor'}</li>
					
					{event name='contentColorListItems'}
				</ul>
				
				{event name='contentColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.container{/lang}</legend>
				
				{* general *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfContainerBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfContainerAccentBackgroundColor' languageVariable='accentBackgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfContainerBorderColor' languageVariable='borderColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfContainerHoverBackgroundColor' languageVariable='hoverBackgroundColor'}</li>
					
					{event name='containerColorListItems'}
				</ul>
				
				{event name='containerColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.userPanel{/lang}</legend>
				
				{* user panel *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfUserPanelBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfUserPanelColor' languageVariable='color'}</li>
					<li>{include file='styleVariableColor' variableName='wcfUserPanelHoverBackgroundColor' languageVariable='hoverBackgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfUserPanelHoverColor' languageVariable='hoverColor'}</li>
					
					{event name='userPanelColorListItems'}
				</ul>
				
				{event name='userPanelColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.tabular{/lang}</legend>
				
				{* general *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfTabularBoxBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfTabularBoxColor' languageVariable='color'}</li>
					<li>{include file='styleVariableColor' variableName='wcfTabularBoxHoverColor' languageVariable='hoverColor'}</li>
					
					{event name='tabularColorListItems'}
				</ul>
				
				{event name='tabularColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.buttons{/lang}</legend>
				
				{* default button *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfButtonBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonBorderColor' languageVariable='borderColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonColor' languageVariable='color'}</li>
					
					{event name='defaultButtonColorListItems'}
				</ul>
				
				{* button:hover *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfButtonHoverBackgroundColor' languageVariable='hoverBackgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonHoverBorderColor' languageVariable='hoverBorderColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonHoverColor' languageVariable='hoverColor'}</li>
					
					{event name='hoverButtonColorListItems'}
				</ul>
				
				{* primary button *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfButtonPrimaryBackgroundColor' languageVariable='primaryBackgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonPrimaryBorderColor' languageVariable='primaryBorderColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfButtonPrimaryColor' languageVariable='primaryColor'}</li>
					
					{event name='primaryButtonColorListItems'}
				</ul>
				
				{event name='buttonsColorLists'}
			</fieldset>
			
			<fieldset>
				<legend>{lang}wcf.acp.style.colors.formInput{/lang}</legend>
				
				{* form input *}{*
				<ul class="colorList">
					<li>{include file='styleVariableColor' variableName='wcfInputBackgroundColor' languageVariable='backgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfInputBorderColor' languageVariable='borderColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfInputColor' languageVariable='color'}</li>
					<li>{include file='styleVariableColor' variableName='wcfInputHoverBackgroundColor' languageVariable='hoverBackgroundColor'}</li>
					<li>{include file='styleVariableColor' variableName='wcfInputHoverBorderColor' languageVariable='hoverBorderColor'}</li>
					
					{event name='formInputColorListItems'}
				</ul>
				
				{event name='formInputColorLists'}
			</fieldset>
			
			{event name='colorFieldsets'}
			*}
		</div>
		
		{* advanced *}
		<div id="advanced" class="container containerPadding tabMenuContainer tabMenuContent">
			{if !$isTainted}
				<nav class="menu">
					<ul>
						<li data-name="advanced-custom"><a href="{@$__wcf->getAnchor('advanced-custom')}">{lang}wcf.acp.style.advanced.custom{/lang}</a></li>
						<li data-name="advanced-original"><a href="{@$__wcf->getAnchor('advanced-original')}">{lang}wcf.acp.style.advanced.original{/lang}</a></li>
					</ul>
				</nav>
				
				<p class="info">{lang}wcf.acp.style.protected{/lang}</p>
				
				{* custom declarations *}
				<div id="advanced-custom">
					<fieldset class="marginTop">
						<legend>{lang}wcf.acp.style.advanced.individualLess{/lang}</legend>
						
						<dl class="wide">
							<dd>
								<textarea id="individualLessCustom" rows="20" cols="40" name="individualLessCustom">{$variables[individualLessCustom]}</textarea>
								<small>{lang}wcf.acp.style.advanced.individualLess.description{/lang}</small>
							</dd>
						</dl>
					</fieldset>
					
					<fieldset{if $errorField == 'overrideLessCustom'} class="formError"{/if}>
						<legend>{lang}wcf.acp.style.advanced.overrideLess{/lang}</legend>
						
						<dl class="wide">
							<dd>
								<textarea id="overrideLessCustom" rows="20" cols="40" name="overrideLessCustom">{$variables[overrideLessCustom]}</textarea>
								{if $errorField == 'overrideLessCustom'}
									<small class="innerError">
										{lang}wcf.acp.style.advanced.overrideLess.error{/lang}
										{implode from=$errorType item=error}{lang}wcf.acp.style.advanced.overrideLess.error.{$error.error}{/lang}{/implode}
									</small>
								{/if}
								<small>{lang}wcf.acp.style.advanced.overrideLess.description{/lang}</small>
							</dd>
						</dl>
					</fieldset>
					{include file='codemirror' codemirrorMode='text/x-less' codemirrorSelector='#individualLessCustom, #overrideLessCustom'}
					
					{event name='syntaxFieldsetsCustom'}
				</div>
				
				{* original declarations / tainted style *}
				<div id="advanced-original">
			{/if}
			
			<fieldset class="marginTop">
				<legend>{lang}wcf.acp.style.advanced.individualLess{/lang}{if !$isTainted} ({lang}wcf.acp.style.protected.less{/lang}){/if}</legend>
				
				<dl class="wide">
					<dd>
						<textarea id="individualLess" rows="20" cols="40" name="individualLess">{$variables[individualLess]}</textarea>
						<small>{lang}wcf.acp.style.advanced.individualLess.description{/lang}</small>
					</dd>
				</dl>
			</fieldset>
			
			<fieldset{if $errorField == 'overrideLess'} class="formError"{/if}>
				<legend>{lang}wcf.acp.style.advanced.overrideLess{/lang}{if !$isTainted} ({lang}wcf.acp.style.protected.less{/lang}){/if}</legend>
				
				<dl class="wide">
					<dd>
						<textarea id="overrideLess" rows="20" cols="40" name="overrideLess">{$variables[overrideLess]}</textarea>
						{if $errorField == 'overrideLess'}
							<small class="innerError">
								{lang}wcf.acp.style.advanced.overrideLess.error{/lang}
								{implode from=$errorType item=error}{lang}wcf.acp.style.advanced.overrideLess.error.{$error.error}{/lang}{/implode}
							</small>
						{/if}
						<small>{lang}wcf.acp.style.advanced.overrideLess.description{/lang}</small>
					</dd>
				</dl>
			</fieldset>
			{include file='codemirror' codemirrorMode='text/x-less' codemirrorSelector='#individualLess, #overrideLess' editable=$isTainted}
			
			{event name='syntaxFieldsetsOriginal'}
			
			{if !$isTainted}
				</div>
			{/if}
		</div>
		
		{event name='tabMenuContents'}
	</div>
	
	<div class="formSubmit">
		<input type="submit" value="{lang}wcf.global.button.submit{/lang}" accesskey="s" />
		<input type="hidden" name="tmpHash" value="{$tmpHash}" />
		{@SECURITY_TOKEN_INPUT_TAG}
	</div>
</form>

<div id="styleDisableProtection" class="jsStaticDialogContent" data-title="{lang}wcf.acp.style.protected.title{/lang}">
	<p>{lang}wcf.acp.style.protected.description{/lang}</p>
	
	<dl class="marginTop">
		<dt></dt>
		<dd><label for="styleDisableProtectionConfirm"><input type="checkbox" id="styleDisableProtectionConfirm"> {lang}wcf.acp.style.protected.confirm{/lang}</label></dd>
	</dl>
	
	<div class="formSubmit">
		<button id="styleDisableProtectionSubmit" disabled>{lang}wcf.global.button.submit{/lang}</button>
	</div>
</div>

{include file='footer'}

<label><input type="checkbox" id="search_{$option->optionName}" name="searchOptions[{$option->optionName}]"{if $searchOption} checked{/if}> {lang}wcf.user.option.searchTextOption{/lang}</label>
<input type="{@$inputType}" id="{$option->optionName}" name="values[{$option->optionName}]" value="{$value}"{if $inputClass} class="{@$inputClass}"{/if}{if !$searchOption} disabled{/if}{if $option->required} required{/if}>

<script data-relocate="true">
	//<![CDATA[
	$(function() {
		$('#search_{$option->optionName}').change(function(event) {
			if ($(event.currentTarget).prop('checked')) {
				$('#{$option->optionName}').enable();
				
				{if $inputType === 'date'}
					$('#{$option->optionName}DatePicker').enable();
				{/if}
			}
			else {
				$('#{$option->optionName}').disable();
				
				{if $inputType === 'date'}
					$('#{$option->optionName}DatePicker').disable();
				{/if}
			}
		});
		
		{if !$searchOption}
			$('#{$option->optionName}DatePicker').disable();
		{/if}
	});
	//]]>
</script>

{include file='header' __disableAds=true}

{include file='formError'}

<p class="info">{lang}wcf.user.newPassword.info{/lang}</p>

<form method="post" action="{link controller='NewPassword'}{/link}">
	<div class="section">
		<dl{if $errorField == 'newPassword'} class="formError"{/if}>
			<dt><label for="newPassword">{lang}wcf.user.newPassword{/lang}</label></dt>
			<dd>
				<input type="password" id="newPassword" name="newPassword" value="{$newPassword}" class="medium">
					
				{if $errorField == 'newPassword'}
					<small class="innerError">
						{if $errorType == 'empty'}{lang}wcf.global.form.error.empty{/lang}{/if}
						{if $errorType == 'notSecure'}{lang}wcf.user.password.error.notSecure{/lang}{/if}
					</small>
				{/if}
			</dd>
		</dl>
		
		<dl{if $errorField == 'confirmNewPassword'} class="formError"{/if}>
			<dt><label for="confirmNewPassword">{lang}wcf.user.confirmPassword{/lang}</label></dt>
			<dd>
				<input type="password" id="confirmNewPassword" name="confirmNewPassword" value="{$confirmNewPassword}" class="medium">
					
				{if $errorField == 'confirmNewPassword'}
					<small class="innerError">
						{if $errorType == 'empty'}{lang}wcf.global.form.error.empty{/lang}{/if}
						{if $errorType == 'notEqual'}{lang}wcf.user.confirmPassword.error.notEqual{/lang}{/if}
					</small>
				{/if}
			</dd>
		</dl>
		
		{event name='fields'}
	</div>
	
	{event name='sections'}
		
	<div class="formSubmit">
		<input type="submit" value="{lang}wcf.global.button.submit{/lang}" accesskey="s">
		{@SECURITY_TOKEN_INPUT_TAG}
	</div>
</form>

{include file='footer' __disableAds=true}

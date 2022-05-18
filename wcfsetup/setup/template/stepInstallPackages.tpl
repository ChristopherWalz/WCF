{include file='header'}

<section class="section">
	<header class="sectionHeader">
		<h2 class="sectionTitle">{lang}wcf.global.next{/lang}</h2>
	</header>
	
	<p>{lang}wcf.global.next.description{/lang}</p>
	
	<form method="get" action="{@RELATIVE_WCF_DIR}acp/index.php">
		<div class="formSubmit">
			<input type="hidden" name="action" value="WCFSetup">
		</div>
	</form>
</section>
<script>
if (typeof window._trackWcfSetupStep === 'function') window._trackWcfSetupStep('installPackages');
</script>
<script>
	window.onload = function() {
		document.forms[0].submit();
	}
</script>

{include file='footer'}

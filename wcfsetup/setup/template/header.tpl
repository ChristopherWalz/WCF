<!DOCTYPE html>
<html dir="{$__wcf->getLanguage()->getPageDirection()}" lang="{$__wcf->getLanguage()->getFixedLanguageCode()}">
<head>
	<meta charset="utf-8">
	<title>{lang}wcf.global.progressBar{/lang} - {lang}wcf.global.title{/lang}</title>

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" media="screen" href="{$setupAssets['WCFSetup.css']}">

	<style type="text/css">
		#pageHeaderContainer {
			height: 100px;
		}

		#pageHeader {
			padding: 30px 20px;
		}
	</style>
</head>

<body>
	<a id="top"></a>

	<div id="pageContainer" class="pageContainer acpPageHiddenMenu">
		<div id="pageHeaderContainer" class="pageHeaderContainer">
			<header id="pageHeader" class="pageHeader">
				<div id="pageHeaderFacade" class="pageHeaderFacade">
					<div class="layoutBoundary">
						<div id="pageHeaderLogo" class="pageHeaderLogo">
							<img src="{$setupAssets['woltlabSuite.png']}" alt="" style="height: 40px; width: 281px;">
						</div>
					</div>
				</div>
			</header>
		</div>

		<section id="main" class="main" role="main">
			<div class="layoutBoundary">
				<div id="content" class="content">
					<header class="contentHeader">
						<div class="contentHeaderTitle">
							<h1 class="contentTitle">{lang}wcf.global.title{/lang}</h1>
							<p class="contentHeaderDescription"><progress id="packageInstallationProgress" value="{$progress}" max="100" style="width: 300px;" title="{$progress}%">{$progress}%</progress></p>
						</div>
					</header>

{capture assign='__websiteUrl'}{link encode=false}{/link}{/capture}
{capture assign='__searchTargetUrl'}{link controller='Search' encode=false}q={/link}{literal}{search_term_string}{/literal}{/capture}
<script type="application/ld+json">
{
"@context": "http://schema.org",
"@type": "WebSite",
"url": {@$__websiteUrl|json},
"potentialAction": {
"@type": "SearchAction",
"target": {@$__searchTargetUrl|json},
"query-input": "required name=search_term_string"
}
}
</script>

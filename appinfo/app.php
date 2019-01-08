<?php
/**
 * Load Javascrip
 */

use OCP\Util;

$eventDispatcher = \OC::$server->getEventDispatcher();
$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function(){
    Util::addScript('SCMeta', 'scmeta.tabview' );
    Util::addScript('SCMeta', 'scmeta.plugin' );
});


(function() {

  OCA.SCMeta = OCA.SCMeta || {};

  /**
   * @namespace
   */
  OCA.SCMeta.Util = {

    /**
     * Initialize the SCMeta plugin.
     *
     * @param {OCA.Files.FileList} fileList file list to be extended
     */
    attach: function(fileList) {

      if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
        return;
      }

      fileList.registerTabView(new OCA.SCMeta.SCMetaTabView('scmetaTabView', {}));
      // icon to open metatab directly
      var fileActions = fileList.fileActions;
      fileActions.registerAction({
				name: 'SC-Meta',
				displayName: '',
				altText: "Schul-Cloud Metadateninfo",
				mime: 'all',
				permissions: OC.PERMISSION_ALL,
				iconClass: 'icon-info',
				type: OCA.Files.FileActions.TYPE_INLINE,
				actionHandler: function(fileName, context) {
          fileList.showDetailsView(fileName, 'scmetaTabView');
					/* // do not open sidebar if permission is set and equal to 0
					var permissions = parseInt(context.$file.data('share-permissions'), 10);
					if (isNaN(permissions) || permissions > 0) {
						fileList.showDetailsView(fileName, 'scmetaTabView');
					}*/
				},
				render: function(actionSpec, isDefault, context) {
          return fileActions._defaultRenderAction.call(fileActions, actionSpec, isDefault, context);
				}
			});
    }
  };
})();

OC.Plugins.register('OCA.Files.FileList', OCA.SCMeta.Util);

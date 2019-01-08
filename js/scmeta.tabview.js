(function() {

  // DOCUMENTATION: https://docs.nextcloud.com/server/14/developer_manual/api/OC/User/User.html

  var SCMetaTabView = OCA.Files.DetailTabView.extend({

    id: 'scmetaTabView',
    className: 'tab scmetaTabView',

    /**
     * get label of tab
     */
    getLabel: function() {
      return t('scmeta', 'SC Metadaten');
    },

    getIcon: function() {
			return 'icon-info';
		},

    /**
     * Renders this details view
     *
     * @abstract
     */
    render: function() {
      this._renderSelectList(this.$el);

      this.delegateEvents({
        'change #choose-algorithm': '_onChangeEvent'
      });

    },

    _renderSelectList: function($el) {
      //debugger;
      fetch("http://localhost:4040/resources?$limit=1", {
        headers: {
          "Authorization": "Basic c2NodWxjbG91ZC1jb250ZW50LTE6Y29udGVudC0x"
        }
      }).then((result) => result.json()).then(json => {
        $el.html(`<pre>${JSON.stringify(json.data, null, 2)}</pre>`);
      }).catch((error) => {
        $el.html(`<div>Can't load metadata</div>`);
      });
    },

    /**
     * show tab only on files
     */
    canDisplay: function(fileInfo) {

      if(fileInfo != null) {
        if(!fileInfo.isDirectory()) {
          return true;
        }
      }
      return true; //false

    },

    /**
     * ajax callback for generating md5 hash
     */
    check: function(fileInfo, algorithmType) {
      // skip call if fileInfo is null
      if(null == fileInfo) {
        _self.updateDisplay({
          response: 'error',
          msg: t('scmeta', 'No fileinfo provided.')
        });

        return;
      }

      var url = OC.generateUrl('/apps/scmeta/check'),
          data = {source: fileInfo.getFullPath(), type: algorithmType},
          _self = this;
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: data,
        async: true,
        success: function(data) {
          _self.updateDisplay(data, algorithmType);
        }
      });

    },

    /**
     * display message from ajax callback
     */
    updateDisplay: function(data, algorithmType) {

      var msg = '';
      if('success' == data.response) {
        msg = algorithmType + ': ' + data.msg;
      }
      if('error' == data.response) {
        msg = data.msg;
      }

      msg += '<br><br><a id="reload-scmeta" class="icon icon-history" style="display:block" href=""></a>';

      this.delegateEvents({
        'click #reload-scmeta': '_onReloadEvent'
      });

      this.$el.find('.get-scmeta').html(msg);

    },

    /**
     * changeHandler
     */
    _onChangeEvent: function(ev) {
      var algorithmType = $(ev.currentTarget).val();
      if(algorithmType != '') {
        this.$el.html('<div style="text-align:center; word-wrap:break-word;" class="get-scmeta"><p><img src="'
          + OC.imagePath('core','loading.gif')
          + '"><br><br></p><p>'
          + t('scmeta', 'Creating SCMeta ...')
          + '</p></div>');
        this.check(this.getFileInfo(), algorithmType);
      }
    },

    _onReloadEvent: function(ev) {
      ev.preventDefault();
      this._renderSelectList(this.$el);
      this.delegateEvents({
        'change #choose-algorithm': '_onChangeEvent'
      });
    }

  });

  OCA.SCMeta = OCA.SCMeta || {};

  OCA.SCMeta.SCMetaTabView = SCMetaTabView;

})();

const app = new Vue({
  el: '#app',
  data: {
    resources: {}
  },
  created: function() {
    const self = this;
    const resourceRegex = /\[(.+?)\]\((.+?)\)\|(.+)/;

    $.get('README.md', function (data) {
      var categories = data.trim().replace(/[\s\S]*?##/m, '##').split(/##\s+/).slice(1);

      $.each(categories, function (_, category) {
        var categoryData = category.trim().split("\n");
        var name = categoryData[0];

        var resourceList = $.map(categoryData.slice(3), function (resource) {
          var matches = resourceRegex.exec(resource);
          return { "name": matches[1], "url": matches[2], "description": matches[3] };
        });

        Vue.set(app.resources, name, resourceList)
      });
    });
  }
});

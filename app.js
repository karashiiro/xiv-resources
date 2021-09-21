const app = new Vue({
  el: '#app',
  data: {
    resources: []
  },
  created: function() {
    const self = this;
    const resourceRegex = /\[(.+?)\]\((.+?)\)\|(.+)/;

    $.get('README.md', function (data) {
      var categories = data.trim().split(/##\s+/).slice(1);

      $.each(categories, function (_, category) {
        var categoryData = category.trim().split("\n\n\n");
        var name = categoryData[0];

        if (categoryData.length === 3) {
          var description = categoryData[1].replace(/\n/g, "<br>");
          var resources = categoryData[2];
        } else {
          var description = "";
          var resources = categoryData[1];
        }

        var resourceList = $.map(resources.split("\n").slice(2), function (resource) {
          var matches = resourceRegex.exec(resource);
          return { "name": matches[1], "url": matches[2], "description": matches[3] };
        });

        self.resources.push({ "name": name, "description": description, "resources": resourceList });
      });
    });
  },
  methods: {
    formatDescription: function(description) {
      // Replace URL markdown with proper anchor tags
      return description.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a> ');
    },
    nameToId: function(category) {
      return category.name.toLowerCase().replace(/[^a-z0-9]+/ig, '-');
    }
  }
});

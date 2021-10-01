const app = new Vue({
  el: '#app',
  data: {
    resources: []
  },
  created: function() {
    const self = this;
    const resourceRegex = /\[(.+?)\]\((.+?)\)\|(.+)/;

    axios.get('README.md')
      .then(function (res) {
        var data = res.data;

        // Split the document into categories
        var categories = data.trim().split(/##\s+/).slice(1);

        for (var i = 0; i < categories.length; i++) {
          var category = categories[i];

          var categoryData = category.trim().split("\n\n\n");
          var name = categoryData[0];

          if (categoryData.length === 3) {
            var description = categoryData[1].replace(/\n/g, "<br>");
            var resources = categoryData[2];
          } else {
            var description = "";
            var resources = categoryData[1];
          }

          // Reshape each resource and push the resulting list back into our state
          var resourceList = resources.split("\n").slice(2).map(function (resource) {
            var matches = resourceRegex.exec(resource);
            return { "name": matches[1], "url": matches[2], "description": matches[3] };
          });

          self.resources.push({ "name": name, "description": description, "resources": resourceList });
        }
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

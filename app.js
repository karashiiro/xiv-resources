var app = PetiteVue.createApp({
  resources: [],
  created: function() {
    var self = this;
    var resourceRegex = /\[(.+?)\]\((.+?)\)\|(.+)/;

    axios.get('README.md')
      .then(function (res) {
        var data = res.data;

        // Split the document into categories
        var categories = data.trim().split(/##\s+/).slice(1);

        for (var i = 0; i < categories.length; i++) {
          var category = categories[i];

          var categoryData = category.trim().split("\n\n\n");
          var name = categoryData[0];

          var description = "";
          if (!categoryData[1].includes('---|---')) {
            description = categoryData[1].replace(/\n/g, "<br>");
            self.resources.push({ "name": name, "description": description, "resources": [] });
            continue;
          }

          // Reshape each resource and push the resulting list back into our state
          var resources = categoryData[1];
          var resourceList = resources.split("\n").slice(2).map(function (resource) {
            var matches = resourceRegex.exec(resource);
            if (matches == null) {
              return null;
            }
            return { "name": matches[1], "url": matches[2], "description": matches[3] };
          }).filter(function(resource) { return resource != null; });

          self.resources.push({ "name": name, "description": description, "resources": resourceList });
        }

        // For some reason, petite-vue reads the array in reverse - flip it
        self.resources = self.resources.reverse();
      });
  },
  formatDescription: function(description) {
    // Replace URL markdown with proper anchor tags
    return description.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a> ');
  },
  nameToId: function(category) {
    return category.name.toLowerCase().replace(/[^a-z0-9]+/ig, '-');
  }
})
.mount('#app');

---
layout: note
notes_active : true
category: note

title: Scripted Tilemill exports
user: olafveerman

filters: guide
image: scripted-export.png
related_post: maps

---
A pretty handy feature that is not well documented in [TileMill](http://mapbox.com/tilemill/), is the possibility to call the export command from the command line. This is useful, for example, when you have to export a project repeatedly with almost the same settings.

In our case we have a dataset with eleven years worth of point data. For our final map, we want to visualize each of these years in a separate layer. Since a TileMill export only contains one layer, we need to export each of these years one by one. To facilitate this process, we create a simple bash script that loops over the years and calls the export process.

To start, we add a selector to the Carto stylesheet that limits the data to a particular year.

{% highlight css %}
#point-data {
	[year=2001] {
		marker-width: 10px
		marker-fill: #F1C40F;
		...
	}
}
{% endhighlight %}

Our bash script loops over these years and basically does the following:

1. changes the selector in the style.mss;
2. changes the project's metadata in project.mml;
3. export the project to .mbtiles format; and
4. upload it to MapBox.


### Bash script
First we define the range that the script should loop over.

{% highlight bash %}
#!/bin/bash

#Make sure the field separator is a ','
IFS=$','
#Define the years to be exported
range=2001,2002,2003,2004

for year in $range
do
{% endhighlight %}

With ```sed``` we search and replace the selector in the style.mss stylesheet for the correct year.

{% highlight bash %}
sed -i -r -e 's/year=[0-9]{4}/year='$year'/g' ~/Documents/MapBox/project/fire-project/style.mss
{% endhighlight %}

Using ```sed``` again, we update the project.mml and change the project name and description so they contain a reference to the year. This helps greatly when browsing the layers on MapBox.

{% highlight bash %}
sed -i -r -e 's/\"name\": \"Fire data\"/\"name\": \"Fire data '$year'\"/g' ~/Documents/MapBox/project/fire-project/project.mml
sed -i -r -e 's/\"description\": \"Detailed point data for fires\"/\"description\": \"Detailed point data for fires '$year'\"/g' ~/Documents/MapBox/project/fire-project/project.mml
{% endhighlight %}

With the right selector set in the style.mss, we are ready to export the layer. The actual export command is pretty self-explanatory. The basic syntax on Ubuntu is: ```/usr/share/tilemill/index.js export [name of project] [destination of export]```, where the export path is relative to the home folder.

{% highlight bash %}
/usr/share/tilemill/index.js export fire-project ~/Documents/fire-project-$year.mbtiles --bbox='-10.2063,36.5361,-5.8557,42.4640' --format=mbtiles --minzoom=4 --maxzoom=13 --metatile=2
{% endhighlight %}

The export command comes with a couple of other options that we didn't include in our example. For a full list you can run ```/usr/share/tilemill/index.js export --help```.

Once exported, we also upload the layer to MapBox hosting with our script. The command to invoke is basically the same as the one used for the export, except for the ```--format=upload```.  
We also add the year to the name of the project to prevent issues when uploading the tiles. If we use the same name for every layer, MapBox simply overwrites the one that was previously uploaded.

{% highlight bash %}
/usr/share/tilemill/index.js export fire-project-$year ~/Documents/fire-project-$year.mbtiles --format=upload --syncAccount="" --syncAccessToken=""
{% endhighlight %}

Note that the --syncAccount and --syncAccessToken options are left empty in this example, but you have to provide them to be able to upload the layers.

This is all you need to export a TileMill project with a bash script. To see a more complete example of this script, you can have a look at the following Gist: [https://gist.github.com/olafveerman/5391804](https://gist.github.com/olafveerman/5391804).
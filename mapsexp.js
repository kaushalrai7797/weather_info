function initMap()
{

    var heatmapdiaplay = 2;
    $("#toggleHeatMap").click(function () {
        if( heatmapdiaplay == 2 )
        {
            $("#heatmap").css("display", "none");
            heatmapdiaplay = 1;
        }
        else {
            $("#heatmap").css("display", "block");
            heatmapdiaplay = 2;
        }
    });
    var anchal;
    var tempadd=[];
    var uluru = {lat: 28.7041, lng: 77.1025};
    var info = $('#info');
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 5,
        center: uluru
    });
    // var marker = new google.maps.Marker({
    //     position: uluru,
    //     map: map,
    //     animation:google.maps.Animation.DROP
    // });
    var Data=[];
    var cord;
    google.maps.event.addListener(map , 'click', function (event)
    {

        var clientID= 'e9513f260b2bb4cfff509d2238e813fa';
        var endPoint= 'https://api.darksky.net/forecast/';
        var parameters= '/'+ event.latLng.lat() +',' +event.latLng.lng() ;
        var url= endPoint + clientID + parameters;

        function AjaxRequest(url , callback) {
            $.ajax({url: url, dataType: 'jsonp', success: function (data){
                callback(data);
            }})
        };

        var weather = [];
        AjaxRequest(url, function (d) {
            Data.push(d);
            console.log(Data);
            for (i=0 ; i<Data.length ; i++)
            {
                //console.log("hello1");
                var dailyd= {
                    "sum" :Data[i].daily.summary,
                    "info":Data[i].daily.data
                }
                weather.push(dailyd);
            }
            $('#info').empty();
            for (i=0 ; i<weather.length; i++)
            {
                info.css({ "border": "2px solid black",
                    "padding" : "2%"
                });
                info.append('<p>'+
                    "LOCATION-"+
                    tempadd[i]+'</p>'
                    );
                info.append('<p>' +
                    "WEATHER SUMMARY-" +
                    weather[i].sum+ '</p>');
                //info.append();
                //info.append('<br>');
                info.append('<p >' +
                    "FORECAST-"+
                    '</p>');
                chart(i);

            }
            
        });

        cord={coords: event.latLng};
        codeLatLng(event.latLng.lat(),event.latLng.lng() );


    });

    function chart(i) {
        console.log("hello");
        info.append('<canvas class="chart_style" id="myChart'+i+'"></canvas>');
        info.append('<div style="border: 1px solid black"></div>')
        var ctx = document.getElementById('myChart'+i).getContext('2d');
        var maxtemp =[];
        var mintemp =[];
        var label=[];
        var m='m';
        for (j=0 ; j<Data[i].daily.data.length ; j++)
        {
            //label.push("m");
            maxtemp.push(Data[i].daily.data[j].apparentTemperatureMax);
            mintemp.push(Data[i].daily.data[j].apparentTemperatureMin);
        }
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [1,2,3,4,5,6,7,8],
                datasets: [{
                    label: 'MAXIMUM TEMPERATURE',
                    data: maxtemp,
                    backgroundColor: "rgba(54, 162, 235,0.6)"
                }, {
                    label: 'MINIMUM TEMPERATURE',
                    data: mintemp,
                    backgroundColor: "rgba(255,0,0,0.6)"
                }]
            }
        });
        console.log("I am here");
        info.append('<br>')
    }

    function addMarker(props)
    {
        var marker = new google.maps.Marker({
            position:props.coords,
            map:map

        });
        if (true)
        {
            var infoWindow = new google.maps.InfoWindow({
                content : '<h4>' + anchal + '</h4>'
            });
            marker.addListener('mouseover' , function () {
                infoWindow.open(map, marker);
            })

            marker.addListener('mouseout' , function () {
                infoWindow.close();
            })
        }
        if( props.iconImage )
        {
            marker.setIcon();
        }

    }
    function codeLatLng(lat, lng)
    {

        var latlng = new google.maps.LatLng(lat, lng);
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    //tempadd = results[0].formatted_address;
                    tempadd.push(results[0].formatted_address);
                    anchal=results[0].formatted_address;
                    addMarker(cord);
                }
                else {
                    alert("No results found");
                }
            }
            else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }
}
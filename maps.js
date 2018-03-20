function initMap()
{
    var tempadd;
    var uluru = {lat: 28.7041, lng: 77.1025};
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 6,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        animation:google.maps.Animation.DROP
    });
    var Data=[];
    var cord;
    google.maps.event.addListener(map , 'click', function (event)
    {
        console.log(event);

        var clientID= 'e9513f260b2bb4cfff509d2238e813fa';
        var endPoint= 'https://api.darksky.net/forecast/';
        console.log(event.latLng.lat());
        var parameters= '/'+ event.latLng.lat() +',' +event.latLng.lng() ;
        var url= endPoint + clientID + parameters;

        function AjaxRequest(url , callback) {
            $.ajax({url: url, dataType: 'jsonp', success: function (data){
                callback(data);
            }})
        };
        AjaxRequest(url, function (d) {
            Data.push(d);
             console.log(Data);
             console.log(Data[0].currently.summary);

        });
        cord={coords: event.latLng};
        codeLatLng(event.latLng.lat(),event.latLng.lng() );

    });

    function addMarker(props)
    {
        //console.log(props.coords);
        var marker = new google.maps.Marker({
            position:props.coords,
            map:map

        });
        if (true)
        {
            var infoWindow = new google.maps.InfoWindow({
                content : '<h4>' + tempadd + '</h4>'
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
                console.log("hello" + results);
                if (results[1]) {
                    //formatted address
                    //console.log("1");
                    tempadd = results[0].formatted_address;
                    //console.log("2");
                    //alert(results[0].formatted_address);
                    //console.log("3");
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

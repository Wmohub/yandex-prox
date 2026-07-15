<!DOCTYPE html>
<html>
<head>
    <title>Yandex Maps Proxy Test</title>
    <!-- Replace YOUR_UNIQUE_APP_NAME below with your real Render subdomain -->
    <script src="https://YOUR_UNIQUE_APP_://onrender.com[optimize]=https://YOUR_UNIQUE_APP_://onrender.com&host_config[vendor]=https://YOUR_UNIQUE_APP_://onrender.com" type="text/javascript"></script>
    
    <style>
        #map {
            width: 100%;
            height: 400px;
            background-color: #e0e0e0;
        }
    </style>
</head>
<body>
    <h2>Testing Yandex Maps Proxy</h2>
    <div id="map"></div>

    <script type="text/javascript">
        // Verifies the proxy successfully hydrated the global namespace
        window.onload = function() {
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(init);
            } else {
                console.error("Ymaps bundle missing. Clear browser cache and check Render logs.");
            }
        };

        function init(){
            var myMap = new ymaps.Map("map", {
                center: [55.76, 37.64], // Coordinates for map rendering
                zoom: 7
            });
            console.log("Map successfully initialized!");
        }
    </script>
</body>
</html>

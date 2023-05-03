# Homey Scripts

HomeyScripts I find useful, and maybe you do too. Scripts made by others are mentioned in the Credits section at the bottom.

## **tibber-price.js**

Checks for lowest, highest and average power price for tomorrow.

- Change the variable **yourAccessTokenFromTibberApiSite** to your access token found in https://developer.tibber.com/settings/accesstoken

If you run the script before 12:00 it will not pass. Prices are published around 13:00, so there's really not point of running it before that.

It writes to three HomeyScript variables you can access in flows:

- TibberPrisIMorgenMin - Lowest price for tomorrow
- TibberPrisIMorgenMax - Highest price for tomorrow
- TibberPrisIMorgenAvg - Average price for tomorrow

Example of use:

- **When**: Time is 13:10
- **And**: Run tibber-price (HomeyScript)
- **Then**: Send a push notification "Power prices for tomorrow: min: \<TibberPrisIMorgenMin\>, max: \<TibberPrisIMorgenMax\>, avg: \<TibberPrisIMorgenAvg\>"

## **fan-control.js**

Turns fan on/off based on house average humidity instead of a fixed value like VHumidity. I wanted it to follow the humidity changes based on seasons, so then I use this script instead of VHumidity.

Set the following variables in the script to match your home:

- zoneName: The name of the zone containing a device marked as a fan and a humidity sensor.
- zoneToIgnore: Name of zones you want to ignore a humidity sensor for a zone, like a second bathroom.
- startLimit: How many percent over average it should start the fan on.
- stopLimit: How many percent over average humidity it should stop the fan on.

Example of use:

- **When**: A sensor value has changed (humidity)
- **And**: \<blank\>
- **Then**: Run fan-control.js (HomeyScript)

## **Credits**

tibber-price.js - Petter Teigen

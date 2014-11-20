✓ basic interface to take a "reference sample and store it

basic interface to scan a sample and compare it to the reference sample

✓requires a non-volatile storage method like a database

peak finding and delta-F between 3 major peaks

✓50Hz steps

✓do a few more scans

✓DB thoughts:

a coin-verifier can have more than one device
a device has a unique id,
an accepted set of scans has a unique id
a device can scan many coins/items
a single or group of coins has a user associated with it

leveldb should be able to:

query all scans from all devices in a coin-shop from a range of dates
query all scans for a device from a range of dates
✓query all scans for a single coin
query all owner for a device
query all owner for a coin-shop
query all scans for a owner

"finer grain scanning needs to be thought about more but looks like this"
query all 'money type' for owner
query all 'money type' for device
query all 'money type' for coin shop

monetary-unit table 
utf8:json

key: monetary-unit(uuid)
value: {
  device:deviceId --> key for device table
  type: {'coin' | 'gold-bar' | 'other'}
  user: userId
}

!scan!monetary-unit(uuid)~(ISO-8601-Date)

scan table 
utf8:json

key: monetary-unit(uuid)~(ISO-8601-Date)
value : {
  monetary-unit   : unitId (uuid)
  data            : json-data
  passed          : boolean
}

a coin shop has many devices
an owner has many coins
a coin has many scans

✓so first thing make some coins...
✓then make some scans...

✓then pull all coins 
✓then pull all scans
✓then pull all scans for a coin

✓done

Date format (iso-8601)

var d = new Date().toISOString()

✓create methods to create scan json
✓create methods to create scan monetary-unit json

✓add finish state to beta
rename beta

✓-- to accomplish this add a private reference to the child process of both
the record and play sox instance and then a function that references both and kills them -- inside beta reference to the entire function is returned with access to the stream through a function and the prototypes to stop both the record and play -- then add the db call to save in a persitent state.

✓add db to server js schema after saving

✓write the db connection helper, then pass that to various model classes 
to create the user / scan models 

✓--> start scan (create MonetaryUnitModel)

✓--> do scan (save as ScanModel)

✓calculate max amplitudes (range of 3-5)

make more than one scan

make a reference scan

compare a scan to a reference scan

need interface to complete the following
--> repeat
--> list scans for certain monetary unit

add the ability to start a "canonical scan" thinking this would be under a /reference scan

add ability to make repeat scans (solve already sent stream error)

overlay current scan with canonical scan

look into making current scan fixed width

display max amplitudes on graph

build interface to list all scans for a coin

build interface to select a scan 

build interface to start and stop scan

✓Jesus Ⓢaves

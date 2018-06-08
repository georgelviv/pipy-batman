# pipy-batman
Pipy batman is batman element from pipy project. Batman receives data over BLE and sendts it over ethernet.
My Symbol is `?`.

# How to setup
1) Install node modules (with --unsafe-perm)
2) node index.js

# Some info about me
ip: 192.168.31.72 (With Xiaomi router)

# How to run
Without parameters
$ sudo node index

With all parameters
$ sudo node index --safe 0 --wsip 192.168.1.1

With safe parameter
$ sudo node index --safe 2

Safe params:
- 0: runs normal with full connectiong
- 1: runs without connection to BLE
- 2: like 2, with consoles from BLE

With different ws ip:
$ sudo node index --wsip 192.168.1.1
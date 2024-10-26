# Also configure all this in rounter DHCP table, 
# that will ensure successful assignment of static ip addresses.
# if your static ip addresses is already taken by another device
# dhcp will negotiate for another IP address, which might cause issue.
# Also thing to note is if you configure your machine mac address to some
# IP address on router that will take priority and dhcp can't help out here.

# Best way is configure the DHCP server,
# Add the require IP address and MAC address bindings. 
# Most routers have this, for DIY projects


# install dhcp client on pi
sudo apt-get install dhcpcd5 -y

# stating the dhcp client demaon
sudo service dhcpcd start
sudo systemctl enable dhcpcd


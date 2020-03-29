var mysql = require('mysql');

tables = {
    'location': ['location_id', 'locality', 'city', 'state', 'country', 'pincode'],
    'neighbouring': ['location1_id', 'location2_id', 'distance_in_km'],
    'administrator': ['admin_id', 'name', 'role', 'email', 'password'],
    'user': ['user_id', 'name', 'email', 'password', 'address', 'phone_no', 'location_id', 'active'],
    'service_provider': ['approved','service_provider_id', 'name', 'password', 'domain','active'],
    'service': ['service_id', 'service_provider_id', 'price', 'discount'],
    'hotel': ['service_provider_id','location_id', 'wifi_facility'],
    'room': ['service_id', 'room_type', 'capacity'],
    'restaurant': ['service_provider_id', 'location_id', 'delivers', 'cuisine'],
    'food_item': ['service_id', 'name', 'cuisine'],
    'flight': ['service_id', 'from_city', 'to_city', 'departure_time', 'arrival_time'],
    'taxi': ['service_id', 'car_name', 'capacity', 'AC'],
    'bus': ['service_id', 'from_location_id', 'to_location_id', 'active_days', 'AC'],
    'route': ['service_id', 'location_id', 'arrival_time'],
    'tourist_spot': ['tourist_spot_id', 'name', 'location_id', 'type', 'entry_fee'],
    'guide': ['service_id', 'tourist_spot_id'],
    'trip': ['trip_id','user_id','departure_date', 'arrival_date', 'city'],
    'service_request': ['request_id', 'trip_id', 'service_id', 'timestamp', 'quantity', 'cost', 'status', 'user_rating', 'service_rating', 'comments'],
    'query': ['query_id', 'user_id', 'query']
}

function createDatabase(onComplete) {
    // callback = function(result) {console.log(result)}
    queryRun=0;
    callback = function(result) {
        queryRun++;
        console.log("done"+queryRun);
        if(queryRun>=73)
            onComplete();
    }
    runQuery(callback, 'drop table if exists visited;')
    runQuery(callback, 'drop table if exists wishlist;')
    runQuery(callback, 'drop table if exists query;')
    runQuery(callback, 'drop table if exists service_request;')
    runQuery(callback, 'drop table if exists trip;')
    runQuery(callback, 'drop table if exists guide;')
    runQuery(callback, 'drop table if exists tourist_spot;')
    runQuery(callback, 'drop table if exists route;')
    runQuery(callback, 'drop table if exists bus;')
    runQuery(callback, 'drop table if exists taxi;')
    runQuery(callback, 'drop table if exists flight;')
    runQuery(callback, 'drop table if exists food_Item;')
    runQuery(callback, 'drop table if exists food_item;')
    runQuery(callback, 'drop table if exists restaurant;')
    runQuery(callback, 'drop table if exists room;')
    runQuery(callback, 'drop table if exists hotel;')
    runQuery(callback, 'drop table if exists service;')
    runQuery(callback, 'drop table if exists service_provider;')
    runQuery(callback, 'drop table if exists administrator;')
    runQuery(callback, 'drop table if exists user;')
    runQuery(callback, 'drop table if exists neighbouring;')
    runQuery(callback, 'drop table if exists location;')

    runQuery(callback, 'create table if not exists location (location_id char(8) primary key,locality varchar(100) not null,city varchar(100) not null,state varchar(100) not null,country varchar(100) not null,pincode int,check (location_id like \"LOC%\"));')
    runQuery(callback, 'create table if not exists neighbouring(location1_id char(8),location2_id char(8),distance_in_km int,primary key(location1_id, location2_id),foreign key (location1_id) references location(location_id),foreign key (location2_id) references location(location_id));')
    runQuery(callback, 'create table if not exists user(user_id char(8) primary key,name varchar(100) not null,email varchar(100) not null,password varchar(100) not null,address varchar(100),phone_no char(10),location_id char(8),active char(1),foreign key(location_id) references location(location_id),check (user_id like \"USR%\"),check(active in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists administrator(admin_id char(8) primary key,name varchar(100) not null, role varchar(100) not null,email varchar(100) not null,password varchar(100),check(admin_id like \"ADM%\"));')
    runQuery(callback, 'create table if not exists service_provider(approved char(1),service_provider_id char(8) primary key,name varchar(100),password varchar(20),domain varchar(20),active char(1),check ((service_provider_id like \"HOT%\" and domain like \"hotel\") or    (service_provider_id like \"RES%\" and domain like \"restaurant\") or(service_provider_id like \"AIR%\" and domain like \"airline\") or (service_provider_id like \"TAP%\" and domain like \"taxi provider\") or    (service_provider_id like \"BPR%\" and domain like \"bus provider\") or (service_provider_id like \"TRP%\" and domain like \"train provider\") or   (service_provider_id like \"GUP%\" and domain like \"guide provider\")),check(active in (\"Y\", \"N\")), check(approved in (\"Y\",\"N\")) );')
    runQuery(callback, 'create table if not exists service(service_id char(8) primary key,service_provider_id char(8),price float,discount int,foreign key (service_provider_id) references service_provider(service_provider_id),check (discount >= 0 and discount <= 100),check ((service_provider_id like \"HOT%\" and service_id like \"ROO%\") or  (service_provider_id like \"RES%\" and service_id like \"FOO%\") or(service_provider_id like \"AIR%\" and service_id like \"FLI%\") or  (service_provider_id like \"TAP%\" and service_id like \"TAX%\") or (service_provider_id like \"BPR%\" and service_id like \"BUS%\") or (service_provider_id like \"TRP%\" and service_id like \"TRA%\") or (service_provider_id like \"GUP%\" and service_id like \"GUI%\") ));')
    runQuery(callback, 'create table if not exists hotel(service_provider_id char(8) primary key,location_id char(8),wifi_facility char(1),foreign key (service_provider_id) references service_provider(service_provider_id),foreign key(location_id) references location(location_id),check (service_provider_id like \"HOT%\"),check (wifi_facility in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists room(service_id char(8) primary key,room_type varchar(100),capacity int,check(service_id like \"ROO%\"),foreign key(service_id) references service(service_id),check (capacity >= 1));')
    runQuery(callback, 'create table if not exists restaurant(service_provider_id char(8) primary key,location_id char(8),delivers char(1),cuisine varchar(100),foreign key (service_provider_id) references service_provider(service_provider_id),check (service_provider_id like \"RES%\"),foreign key(location_id) references location(location_id),check (delivers in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists food_item(service_id char(8) primary key,name varchar(100),cuisine varchar(100),foreign key(service_id) references service(service_id),check (service_id like \"FOO%\"));')
    runQuery(callback, 'create table if not exists flight(service_id char(8) primary key,from_city varchar(100),to_city varchar(100),departure_time datetime,arrival_time datetime,foreign key(service_id) references service(service_id),check (service_id like \"FLI%\"),check (departure_time < arrival_time));')
    runQuery(callback, 'create table if not exists taxi(service_id char(8) primary key,car_name varchar(100),capacity int,AC char(1),foreign key(service_id) references service(service_id),check (service_id like \"TAX%\"),check (capacity >= 0),check (AC in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists bus(service_id char(8) primary key,from_location_id char(8),to_location_id char(8),active_days char(7),AC char(1),foreign key(service_id) references service(service_id),check (service_id like \"BUS%\"),foreign key(from_location_id) references location(location_id),foreign key(to_location_id) references location(location_id),check (active_days like \"[YN][YN][YN][YN][YN][YN][YN]\"),check (AC in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists route (service_id char(8),location_id char(8),arrival_time time,primary key (service_id, location_id),foreign key(service_id) references service(service_id),foreign key(location_id) references location(location_id));')
    runQuery(callback, 'create table if not exists tourist_spot (tourist_spot_id char(8) primary key,name varchar(100),location_id char(8),type varchar(100),entry_fee float,foreign key(location_id) references location(location_id));')
    runQuery(callback, 'create table if not exists guide (service_id char(8) primary key,tourist_spot_id char(8),foreign key(service_id) references service(service_id),check (service_id like \"GUI%\"),foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id));')
    runQuery(callback, 'create table if not exists trip (trip_id char(8) primary key,user_id char(8),departure_date date,arrival_date date,city varchar(100),foreign key(user_id) references user(user_id));')
    runQuery(callback, 'create table if not exists service_request (request_id char(8) primary key,trip_id char(8),service_id char(8) not null,timestamp datetime,quantity int not null,cost int not null,status varchar(15) not null,user_rating int,service_rating int,comments varchar(1000),foreign key(trip_id) references trip(trip_id),foreign key(service_id) references service(service_id),check (status in (\"Pending\", \"Accepted\", \"Rejected\", \"Completed\", \"Paid\")),check (user_rating >= 0 and user_rating <= 5),check (service_rating >= 0 and service_rating <= 5));')
    runQuery(callback, 'create table if not exists query (query_id char(8), user_id char(8), query varchar(100),foreign key(user_id) references user(user_id));')
    runQuery(callback, 'create table if not exists wishlist (user_id char(8), tourist_spot_id char(8), primary key(user_id, tourist_spot_id), foreign key(user_id) references user(user_id), foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id))');
    runQuery(callback, 'create table if not exists visited (trip_id char(8), tourist_spot_id char(8), primary key(trip_id, tourist_spot_id), foreign key(trip_id) references trip(trip_id), foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id))');

    runQuery(callback, 'INSERT INTO location VALUES(\'LOC00000\',\'pangong lake\',\'ladakh\',\'J&K\',\'India\',194101),(\'LOC00001\',\'Zanskar Valley\',\'ladakh\',\'J&K\',\'India\',194102),(\'LOC00002\',\'Tso Moriri\',\'ladakh\',\'J&K\',\'India\',194103),(\'LOC00003\',\'Ladakh\',\'ladakh\',\'J&K\',\'India\',194101),(\'LOC00004\',\'Leh\',\'Leh\',\'J&K\',\'India\',194104),(\'LOC00005\',\'Srinagar\',\'Srinagar\',\'J&K\',\'India\',190001),(\'LOC00006\',\'Dal Lake\',\'Srinagar\',\'J&K\',\'India\',190002),(\'LOC00007\',\'Shalimar Bagh\',\'Srinagar\',\'J&K\',\'India\',190003),(\'LOC00008\',\'Shimla\',\'Shimla\',\'Himachal Pradesh\',\'India\',171001),(\'LOC00009\',\'Rishikesh\',\'Dehradun\',\'Uttrakhand\',\'India\',249201),(\'LOC00010\',\'Badrinath\',\'Chamoli\',\'Uttrakhand\',\'India\',249202),(\'LOC00011\',\'Haridwar\',\'Haridwar\',\'Uttrakhand\',\'India\',249401),(\'LOC00012\',\'Amritsar\',\'Amritsar\',\'Punjab\',\'India\',143001),(\'LOC00013\',\'Golden Temple\',\'Amritsar\',\'Punjab\',\'India\',143002),(\'LOC00014\',\'Wagah Border\',\'Amritsar\',\'Punjab\',\'India\',143003),(\'LOC00015\',\'Delhi\',\'Delhi \',\'Delhi\',\'India\',110000),(\'LOC00016\',\'Red Fort\',\'Delhi \',\'Delhi\',\'India\',110011),(\'LOC00017\',\'Qutub Minar\',\'Delhi \',\'Delhi\',\'India\',110054),(\'LOC00018\',\'India Gate\',\'Delhi \',\'Delhi\',\'India\',110024),(\'LOC00019\',\'Jodhpur\',\'Jodhpur\',\'Rajasthan\',\'India\',342154),(\'LOC00020\',\'Agra\',\'Agra \',\'Uttar Pradesh\',\'India\',234142),(\'LOC00021\',\'Fatehpur Sikri\',\'Agra \',\'Uttar Pradesh\',\'India\',334192),(\'LOC00022\',\'Agra Fort\',\'Agra \',\'Uttar Pradesh\',\'India\',334182),(\'LOC00023\',\'Shivpui\',\'Shivpuri\',\'Madhya Pradesh\',\'India\',473551),(\'LOC00024\',\'Sanchi \',\'Raisen\',\'Madhya Pradesh\',\'India\',482164),(\'LOC00025\',\'Kanha National Park\',\'Balaghat\',\'Madhya Pradesh\',\'India\',481001),(\'LOC00026\',\'Mount Abu\',\'Sirohi\',\'Rajasthan\',\'India\',307501),(\'LOC00027\',\'Abu Road\',\'Sirohi\',\'Rajasthan\',\'India\',307530),(\'LOC00028\',\'Gir National Park\',\'Junagadh\',\'Gujrat\',\'India\',362001),(\'LOC00029\',\'Mumbai\',\'Mumbai\',\'Maharashtra\',\'India\',400001),(\'LOC00030\',\'Navi Mumbai\',\'Thane\',\'Maharashtra\',\'India\',400002),(\'LOC00031\',\'Marine Drive\',\'Mumbai\',\'Maharashtra\',\'India\',400003),(\'LOC00032\',\'Ellora Caves\',\'Aurangabad\',\'Maharashtra\',\'India\',472164),(\'LOC00033\',\'Ajanta Caves\',\'Aurangabad\',\'Maharashtra\',\'India\',472178),(\'LOC00034\',\'Panjim\',\'Goa\',\'Goa\',\'India\',403001),(\'LOC00035\',\'Calangute\',\'North Panji\',\'Goa\',\'India\',403213),(\'LOC00036\',\'Vijaypura\',\'Bijapur\',\'Karnataka\',\'India\',586101),(\'LOC00037\',\'Hampi\',\'Ballari\',\'Karnataka\',\'India\',588101),(\'LOC00038\',\'Hydrabad\',\'Hydrabad\',\'Telangana\',\'India\',500512),(\'LOC00039\',\'Vishakhapatnam\',\'Vishakhapatnam\',\'Andhra Pradesh\',\'India\',530612),(\'LOC00040\',\'Shillong\',\'Shillong\',\'Meghalaya\',\'India\',634514),(\'LOC00041\',\'Kaziranga\',\'Karbi Anglong\',\'Assam\',\'India\',612414),(\'LOC00042\',\'Chennai\',\'Chennai\',\'Tamil Nadu\',\'India\',600001),(\'LOC00043\',\'Vadodara\',\'Vadodara\',\'Gujarat\',\'India\',390007),(\'LOC00044\',\'Ahmedabad\',\'Ahmedabad\',\'Gujarat\',\'India\',380001),(\'LOC00045\',\'Bangalore\',\'Bangalore\',\'Karnataka\',\'India\',560008),(\'LOC00046\',\'Kolkata\',\'Kolkata\',\'West Bengal\',\'India\',700019),(\'LOC00047\',\'Pune\',\'Pune\',\'Maharashtra\',\'India\',411014),(\'LOC00048\',\'Hydrabad\',\'Hyderabad\',\'Telangana\',\'India\',500003);')
    runQuery(callback, 'INSERT INTO neighbouring VALUES(\'LOC00000\',\'LOC00001\',5),(\'LOC00000\',\'LOC00002\',10),(\'LOC00000\',\'LOC00003\',15),(\'LOC00001\',\'LOC00002\',3),(\'LOC00001\',\'LOC00003\',8),(\'LOC00002\',\'LOC00003\',11),(\'LOC00004\',\'LOC00000\',51),(\'LOC00004\',\'LOC00001\',56),(\'LOC00004\',\'LOC00002\',61),(\'LOC00004\',\'LOC00003\',49),(\'LOC00005\',\'LOC00000\',81),(\'LOC00005\',\'LOC00006\',15),(\'LOC00005\',\'LOC00007\',9),(\'LOC00006\',\'LOC00007\',12),(\'LOC00008\',\'LOC00009\',75),(\'LOC00009\',\'LOC00011\',24),(\'LOC00009\',\'LOC00010\',13),(\'LOC00010\',\'LOC00011\',18),(\'LOC00012\',\'LOC00013\',6),(\'LOC00012\',\'LOC00014\',10),(\'LOC00013\',\'LOC00014\',12),(\'LOC00015\',\'LOC00016\',21),(\'LOC00015\',\'LOC00017\',31),(\'LOC00015\',\'LOC00018\',12),(\'LOC00016\',\'LOC00017\',24),(\'LOC00016\',\'LOC00018\',16),(\'LOC00017\',\'LOC00018\',31),(\'LOC00020\',\'LOC00021\',12),(\'LOC00020\',\'LOC00022\',8),(\'LOC00021\',\'LOC00022\',16),(\'LOC00023\',\'LOC00024\',48),(\'LOC00026\',\'LOC00027\',15),(\'LOC00029\',\'LOC00030\',20),(\'LOC00029\',\'LOC00031\',25),(\'LOC00030\',\'LOC00031\',18),(\'LOC00032\',\'LOC00033\',35),(\'LOC00034\',\'LOC00035\',16),(\'LOC00036\',\'LOC00037\',26);')
    runQuery(callback, 'INSERT INTO user VALUES(\'USR00000\',\'Neeraf \',\'Neeraf@432gmail.com.com\',\'Nera333\',\'138, Angappa Naicken St, Parrys Chennai, Tamil Nadu, 600001\',4425229885,\'LOC00042\',\'Y\'),(\'USR00001\',\'Ekambar \',\'Ekambar@109yahoo.com\',\'pyasf3333\',\'M 9, Part 1, Greater Kailash Delhi, Delhi, 110048\',1129234950,\'LOC00015\',\'Y\'),(\'USR00002\',\'Sankalpa \',\'Sankalpa@322yahoo.com\',\'pfasdre3333\',\'18/19, Alkapuri, 18/19, Alkapuri Vadodara, Gujarat, 390007\',2652337966,\'LOC00043\',\'Y\'),(\'USR00003\',\'Fatik \',\'Fatik@41gmail.com\',\'pyarsdfae33\',\'136, Narayan Dhuru Street, Masjid Bunder Mumbai, Maharashtra, 400003\',2223450058,\'LOC00029\',\'Y\'),(\'USR00004\',\'Shashimohan \',\'Shashimohan@12gmail.com\',\'pyargf3333\',\'Shop No 9, Stn, Nr Silky, Santacruz (west) Mumbai, Maharashtra, 400054\',2226052751,\'LOC00029\',\'Y\'),(\'USR00005\',\'Bhuvanesh\',\'Bhuvanesh@34gmail.com\',\'pyare33dsf33\',\'Shop No 6, D/14, Yogi Nagar, Eksar Road, Borivali (west) Mumbai, Maharashtra, 400091\',3222898524,\'LOC00029\',\'Y\'),(\'USR00006\',\'Tripurari \',\'Tripurari@24gmail.com\',\'pyare333dfs3\',\'21c, Pkt-3, Mig Flat, Mayur Vihar Delhi, Delhi, 110096\',1122615327,\'LOC00015\',\'Y\'),(\'USR00007\',\'Mangal \',\'mangal@238gmail.com\',\'pyare3fdsa333\',\'173, Sarvoday Comm Centre, Salapose Road, Nr Gpo, Ahmedabad, Gujarat, 380001\',7925504021,\'LOC00044\',\'Y\'),(\'USR00008\',\'Raghupati \',\'raghu@288gmail.com\',\'pyare3fd333\',\'36, 16th Cross C M H Road, Lakshmipuram, Ulsoor Bangalore, Karnataka, 560008\',4425575389,\'LOC00045\',\'Y\'),(\'USR00009\',\'Daiwik \',\'daiwik@277gmail.com\',\'pyare33df33\',\'Prasad Heights, 43 Somnath Nagar, Vadgaonsheri, Pune, Maharashtra, 411014\',9242703174,\'LOC00047\',\'Y\'),(\'USR00010\',\'Gagan\',\'gagan@266gmail.com\',\'pyare3df333\',\'167- P, Rashbehari Avenue, Ballygunj, Kolkata, West Bengal, 700019\',8489245681,\'LOC00046\',\'Y\'),(\'USR00011\',\'Jagadbandu \',\'jaga@254gmail.com\',\'jagaasasda\',\'84, Devloped Indl Estate, Perungudi, Chennai, Tamil Nadu, 600096\',2684405124,\'LOC00042\',\'Y\'),(\'USR00012\',\'Uday\',\'uday@244gmail.com\',\'uda234\',\'27, Heavy Water Colony, Chhani Jakat Naka, Vadodara, Gujarat, 390002\',3424961708,\'LOC00043\',\'Y\'),(\'USR00013\',\'Viswas \',\'viswas@2gmail.com\',\'viswasasdadada\',\'24 Temple Road, Agaram Chennai, Tamil Nadu, 600082\',3525378703,\'LOC00042\',\'Y\'),(\'USR00014\',\'Saket \',\'saket@21gmail.com\',\'saket67787777\',\'15 & 16, Richmond Town, Bangalore, Karnataka, 560025\',8022220296,\'LOC00045\',\'Y\'),(\'USR00015\',\'Jusal \',\'jusal@2454gmail.com\',\'jusal1231231\',\'5, 100 Ft Rd, Vysys Bank Colony, B T M Bangalore, Karnataka, 560076\',8726687005,\'LOC00045\',\'Y\'),(\'USR00016\',\'Kunjabihari \',\'kunj@2354gmail.com\',\'kunjklklklasdf\',\'22, Royapettah High Road, Royapettah, Chennai, Tamil Nadu, 600014\',9721623577,\'LOC00042\',\'Y\'),(\'USR00017\',\'Ottakoothan \',\'ottak@3435yahoo.com\',\'ottak1113\',\'1-8-303/69/3, S P Road, Hyderabad, Telangana, 500003\',4428114197,\'LOC00048\',\'Y\'),(\'USR00018\',\'Naval \',\'naval@234gmail.com\',\'naval1111\',\'1a Chirag Mansion, Khetwadi Back Rd, Khetwadi, Mumbai, Maharashtra, 400004\',4027849319,\'LOC00029\',\'Y\'),(\'USR00019\',\'Pyaremohan \',\'pyare@123gmail.com\',\'pyare3333\',\'420, Shri Ram Bhawan, Chandni Chowk Delhi, Delhi, 110006\',1123928452,\'LOC00015\',\'Y\');')
    runQuery(callback, 'INSERT INTO administrator VALUES(\'ADM00000\',\'vekine\',\'Admin\',\'vekine@gmail.com\',\'vekine123\'),(\'ADM00001\',\'Quest\',\'Service providers communications\',\'quet@gmail.com\',\'quet123\'),(\'ADM00002\',\'koneu\',\'Service providers communications\',\'koneu@gmail.com\',\'koeneu123\'),(\'ADM00003\',\'beqone\',\'Service providers communications\',\'bequone@gmail.com\',\'bequone123\'),(\'ADM00004\',\'Keao\',\'Statistician\',\'keao@gmail.com\',\'keao123\'),(\'ADM00005\',\'heotin\',\'Official Paperwork\',\'heotin@gmail.com\',\'heotin123\'),(\'ADM00006\',\'Joegit\',\'User Information handling\',\'joegit@gmail.com\',\'joegit123\'),(\'ADM00007\',\'vibege\',\'User Information handling\',\'vubege@gmail.com\',\'vubege123\'),(\'ADM00008\',\'lenyber\',\'Suggestions Implementation\',\'lenyber@gmail.com\',\'lenyber123\'),(\'ADM00009\',\'niceher\',\'Respondent for user queries\',\'niceher@gmail.com\',\'niceher123\'),(\'ADM00010\',\'sivepec\',\'Respondent for user queries\',\'sivepec@gmail.com\',\'sivepec123\'),(\'ADM00011\',\'jesotun\',\'Verification of guides\',\'jesotn@gmail.com\',\'jesotn123\'),(\'ADM00012\',\'pedakij\',\'Tourist Spots Verification\',\'pedakij@gmail.com\',\'pedakij123\'),(\'ADM00013\',\'zedart\',\'Tourist Spots Verification\',\'zedart0@gmail.com\',\'zedart0123\'),(\'ADM00014\',\'beqzasi\',\'Editor\',\'beqzasi1@gmail.com\',\'beqzasi1123\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'BPR00042\',\'kat\',\'kat345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00043\',\'tak\',\'tak345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00044\',\'sohail\',\'sohail345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00045\',\'mohan\',\'mohan345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00046\',\'sohan\',\'sohan345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00047\',\'rohan\',\'rohan345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00048\',\'bhol\',\'bhol345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00049\',\'dol\',\'dhol345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00050\',\'gol\',\'gol345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00051\',\'bol\',\'bol345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00052\',\'sop\',\'sop345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00053\',\'cop\',\'cop345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00054\',\'hanry\',\'hanry345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00055\',\'tom\',\'tom345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00056\',\'jerry\',\'jerry345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00057\',\'spider\',\'spider345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00058\',\'map\',\'map345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00059\',\'bat\',\'bat345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00060\',\'john\',\'john345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00061\',\'donu\',\'donu345\',\'Bus Provider\',\'Y\'),(\'Y\',\'BPR00062\',\'bonu\',\'bonu345\',\'Bus Provider\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'AIR00017\',\'fog\',\'fog456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00018\',\'gol\',\'gol456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00019\',\'sonu\',\'sonu456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00020\',\'farry\',\'farry456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00021\',\'hanti\',\'hanti456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00022\',\'sot\',\'sot456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00023\',\'ewi\',\'ewi456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00024\',\'ftgf\',\'ftgf456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00025\',\'goli\',\'goli456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00026\',\'roli\',\'roli456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00027\',\'doop\',\'doop456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00028\',\'Vivanta\',\'Vivanta456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00029\',\'oogy\',\'oogy456\',\'Airline\',\'Y\'),(\'Y\',\'AIR00031\',\'mooood\',\'mooood456\',\'Airline\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'TAP00032\',\'fsadf\',\'fsadf234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00033\',\'asdf\',\'asdf234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00034\',\'asdfe\',\'asdfe234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00035\',\'ffd\',\'ffd234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00036\',\'hgs\',\'hgs234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00037\',\'fe\',\'fe234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00038\',\'asdfg\',\'asdfg234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00039\',\'sdfg\',\'sdfg234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00040\',\'fdgds\',\'fdgds234\',\'Taxi Provider\',\'Y\'),(\'Y\',\'TAP00041\',\'daby\',\'daby234\',\'Taxi Provider\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'TRP00001\',\'dgy\',\'dgy567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00002\',\'bruno\',\'bruno567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00003\',\'hanrr\',\'hanrr567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00004\',\'jacck\',\'jacck567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00005\',\'kaf\',\'kaf567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00006\',\'jaf\',\'jaf567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00007\',\'daf\',\'daf567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00008\',\'gah\',\'gah567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00009\',\'hui\',\'hui567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00010\',\'noody\',\'noody567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00011\',\'truc\',\'truc567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00012\',\'banc\',\'banc567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00013\',\'hju\',\'hju567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00014\',\'dfy\',\'dfy567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00015\',\'dcv\',\'dcv567\',\'Train Provider\',\'Y\'),(\'Y\',\'TRP00016\',\'rty\',\'rty567\',\'Train Provider\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'RES00001\',\'gooby\',\'gooby789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00002\',\'comb\',\'comb789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00003\',\'bom\',\'bom789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00004\',\'tooop\',\'tooop789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00005\',\'gooory\',\'gooory789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00006\',\'suri\',\'suri789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00007\',\'sudi\',\'sudi789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00008\',\'gooku\',\'gooku789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00009\',\'dooku\',\'dooku789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00010\',\'rummy\',\'rummy789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00011\',\'bunny\',\'bunny789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00012\',\'goosy\',\'goosy789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00013\',\'sory\',\'sory789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00014\',\'dee\',\'dee789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00015\',\'bee\',\'bee789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00016\',\'gee\',\'gee789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00017\',\'gelu\',\'gelu789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00018\',\'abus\',\'abus789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00019\',\'smil\',\'smil789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00020\',\'adbdul\',\'adbdul789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00021\',\'vohn\',\'vohn789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00022\',\'vohmu\',\'vohmu789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00023\',\'choi\',\'vhoi789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00024\',\'fooky\',\'fooky789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00025\',\'gluudy\',\'gluudy789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00026\',\'hine\',\'hine789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00027\',\'bonyyy\',\'bonyyy789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00028\',\'dasyyyy\',\'dasyyyy789\',\'Restaurant\',\'Y\'),(\'Y\',\'RES00029\',\'chittt\',\'chittt789\',\'Restaurant\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'HOT00001\',\'vanyr\',\'vanyr55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00002\',\'vanyK\',\'vanyk55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00003\',\'fnaay\',\'fnaay55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00004\',\'hyi\',\'hyi55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00005\',\'chittt\',\'chittt55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00006\',\'rits\',\'rits55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00007\',\'chittt\',\'chittt55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00008\',\'dereee\',\'dereee55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00009\',\'wen1\',\'wen155\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00010\',\'dttt\',\'dttt55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00011\',\'fog\',\'fog55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00012\',\'liion\',\'liion55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00013\',\'lion\',\'lion55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00014\',\'tigeey\',\'tigeey55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00016\',\'chini\',\'chini55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00017\',\'pini\',\'pini55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00019\',\'jummy\',\'jummy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00020\',\'fuunaay\',\'fuunaay55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00022\',\'gout\',\'gout55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00023\',\'goat\',\'goat55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00025\',\'pub\',\'pub55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00026\',\'pab\',\'pab55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00027\',\'palu\',\'palu55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00028\',\'paly\',\'paly55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00029\',\'palt\',\'palt55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00030\',\'part\',\'part55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00031\',\'aly\',\'aly55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00032\',\'alyuni\',\'alyuni55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00033\',\'chungg\',\'chungg55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00034\',\'geek\',\'geek55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00035\',\'ofty\',\'ofty55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00036\',\'softy\',\'softy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00037\',\'johmy\',\'johmy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00038\',\'dopy\',\'dopy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00039\',\'vog\',\'vog55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00040\',\'vol\',\'vol55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00041\',\'val\',\'val55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00042\',\'callyy\',\'callyy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00044\',\'gooooooopy\',\'gooooooopy55\',\'Hotel\',\'Y\'),(\'Y\',\'HOT00045\',\'aqua\',\'aqua55\',\'Hotel\',\'Y\');')
    runQuery(callback, 'INSERT INTO service_provider VALUES(\'Y\',\'GUP00000\',\'aquamann\',\'aquamann44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00001\',\'joks\',\'joks44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00002\',\'manup\',\'manup44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00003\',\'scuuby\',\'scuuby44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00004\',\'boof\',\'boof44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00005\',\'hell2\',\'hell244\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00006\',\'hell1\',\'hell144\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00007\',\'goog\',\'goog44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00008\',\'joffy\',\'joffy44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00009\',\'juney\',\'juney44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00010\',\'buney\',\'buney44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00011\',\'foggggggy\',\'foggggggy44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00012\',\'rabbit\',\'rabbit44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00013\',\'fooooogg\',\'fooooogg44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00014\',\'toyyyyy\',\'toyyyyy44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00015\',\'boooolu\',\'boooolu44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00016\',\'aqua\',\'aqua44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00017\',\'asfsaa\',\'asfsaa44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00018\',\'voif\',\'voif44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00019\',\'hojiji\',\'hojiji44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00020\',\'qubek\',\'qubek44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00021\',\'ebi\',\'ebi44\',\'Guide Provider\',\'Y\'),(\'Y\',\'GUP00022\',\'usiiii\',\'usiiii44\',\'Guide Provider\',\'Y\');')
    runQuery(callback, 'INSERT INTO service VALUES(\'BUS00001\',\'BPR00042\',4000,5),(\'BUS00002\',\'BPR00043\',2000,10),(\'BUS00003\',\'BPR00044\',6000,15),(\'BUS00004\',\'BPR00045\',7000,20),(\'BUS00005\',\'BPR00046\',3000,40),(\'BUS00006\',\'BPR00047\',4000,20),(\'BUS00007\',\'BPR00048\',8000,5),(\'BUS00008\',\'BPR00049\',5000,10),(\'BUS00009\',\'BPR00050\',4000,15),(\'BUS00010\',\'BPR00051\',5000,20),(\'BUS00011\',\'BPR00052\',6000,5),(\'BUS00012\',\'BPR00053\',5000,10),(\'BUS00013\',\'BPR00054\',4000,0),(\'BUS00014\',\'BPR00055\',8000,5),(\'BUS00015\',\'BPR00056\',2000,0),(\'BUS00016\',\'BPR00057\',2000,40),(\'BUS00017\',\'BPR00058\',2000,20),(\'BUS00018\',\'BPR00059\',2000,20),(\'BUS00019\',\'BPR00060\',5000,5),(\'BUS00020\',\'BPR00061\',4000,10),(\'BUS00021\',\'BPR00062\',3000,10);')
    runQuery(callback, 'INSERT INTO service VALUES(\'FLI00000\',\'AIR00017\',6000,5),(\'FLI00001\',\'AIR00018\',3000,10),(\'FLI00002\',\'AIR00019\',4500,5),(\'FLI00003\',\'AIR00020\',5000,5),(\'FLI00004\',\'AIR00021\',10000,0),(\'FLI00005\',\'AIR00022\',6000,5),(\'FLI00006\',\'AIR00023\',5500,10),(\'FLI00007\',\'AIR00024\',6000,10),(\'FLI00008\',\'AIR00025\',6000,5),(\'FLI00009\',\'AIR00026\',7000,10),(\'FLI00010\',\'AIR00027\',7000,5),(\'FLI00011\',\'AIR00028\',12000,10),(\'FLI00012\',\'AIR00029\',6000,0),(\'FLI00014\',\'AIR00031\',6000,5);')
    runQuery(callback, 'INSERT INTO service VALUES(\'ROO00001\',\'HOT00001\',1000,5),(\'ROO00002\',\'HOT00002\',2000,10),(\'ROO00003\',\'HOT00003\',4000,5),(\'ROO00004\',\'HOT00004\',3000,15),(\'ROO00005\',\'HOT00005\',2000,20),(\'ROO00006\',\'HOT00006\',1500,10),(\'ROO00007\',\'HOT00007\',2500,0),(\'ROO00008\',\'HOT00008\',3500,5),(\'ROO00009\',\'HOT00009\',2000,10),(\'ROO00010\',\'HOT00010\',1500,0),(\'ROO00011\',\'HOT00011\',5000,0),(\'ROO00012\',\'HOT00012\',2000,10),(\'ROO00013\',\'HOT00013\',3000,5),(\'ROO00014\',\'HOT00014\',800,10),(\'ROO00016\',\'HOT00016\',1500,20),(\'ROO00017\',\'HOT00017\',2000,10),(\'ROO00019\',\'HOT00019\',500,0),(\'ROO00020\',\'HOT00020\',4500,10),(\'ROO00022\',\'HOT00022\',3400,0),(\'ROO00023\',\'HOT00023\',5600,15),(\'ROO00025\',\'HOT00025\',2300,10),(\'ROO00026\',\'HOT00026\',10000,0),(\'ROO00027\',\'HOT00027\',5000,0),(\'ROO00028\',\'HOT00028\',2000,5),(\'ROO00029\',\'HOT00029\',8000,10),(\'ROO00030\',\'HOT00030\',1200,20),(\'ROO00031\',\'HOT00031\',1800,5),(\'ROO00032\',\'HOT00032\',3200,0),(\'ROO00033\',\'HOT00033\',4700,0),(\'ROO00034\',\'HOT00034\',3300,0),(\'ROO00035\',\'HOT00035\',5000,10),(\'ROO00036\',\'HOT00036\',4300,15),(\'ROO00037\',\'HOT00037\',3100,0),(\'ROO00038\',\'HOT00038\',2000,0),(\'ROO00039\',\'HOT00039\',3400,5),(\'ROO00040\',\'HOT00040\',2100,10),(\'ROO00041\',\'HOT00041\',2700,0),(\'ROO00042\',\'HOT00042\',2300,0),(\'ROO00044\',\'HOT00044\',2100,0),(\'ROO00045\',\'HOT00045\',2300,0);')
    runQuery(callback, 'INSERT INTO service VALUES(\'TAX00001\',\'TAP00032\',1500,5),(\'TAX00002\',\'TAP00033\',1200,0),(\'TAX00003\',\'TAP00034\',3000,10),(\'TAX00004\',\'TAP00035\',1500,10),(\'TAX00005\',\'TAP00036\',1600,5),(\'TAX00006\',\'TAP00037\',2200,10),(\'TAX00007\',\'TAP00038\',2000,10),(\'TAX00008\',\'TAP00039\',1800,5),(\'TAX00009\',\'TAP00040\',1200,0),(\'TAX00010\',\'TAP00041\',1500,10);')
    runQuery(callback, 'INSERT INTO service VALUES(\'TRA00001\',\'TRP00001\',8000,5),(\'TRA00002\',\'TRP00002\',4000,10),(\'TRA00003\',\'TRP00003\',5000,0),(\'TRA00004\',\'TRP00004\',6000,10),(\'TRA00005\',\'TRP00005\',7000,5),(\'TRA00006\',\'TRP00006\',4500,10),(\'TRA00007\',\'TRP00007\',5000,15),(\'TRA00008\',\'TRP00008\',6000,0),(\'TRA00009\',\'TRP00009\',8000,50),(\'TRA00010\',\'TRP00010\',7000,20),(\'TRA00011\',\'TRP00011\',6000,30),(\'TRA00012\',\'TRP00012\',4000,20),(\'TRA00013\',\'TRP00013\',8000,40),(\'TRA00014\',\'TRP00014\',9000,20),(\'TRA00015\',\'TRP00015\',10000,20),(\'TRA00016\',\'TRP00016\',5000,10);')
    runQuery(callback, 'INSERT INTO service VALUES(\'FOO00001\',\'RES00001\',200,0),(\'FOO00002\',\'RES00002\',40,0),(\'FOO00003\',\'RES00003\',250,5),(\'FOO00004\',\'RES00004\',180,10),(\'FOO00005\',\'RES00005\',350,0),(\'FOO00006\',\'RES00006\',50,0),(\'FOO00007\',\'RES00007\',80,5),(\'FOO00008\',\'RES00008\',320,15),(\'FOO00009\',\'RES00009\',60,20),(\'FOO00010\',\'RES00010\',80,0),(\'FOO00011\',\'RES00011\',300,0),(\'FOO00012\',\'RES00012\',250,0),(\'FOO00013\',\'RES00013\',180,0),(\'FOO00014\',\'RES00014\',120,5),(\'FOO00015\',\'RES00015\',300,10),(\'FOO00016\',\'RES00016\',350,10),(\'FOO00017\',\'RES00017\',400,15),(\'FOO00018\',\'RES00018\',200,5),(\'FOO00019\',\'RES00019\',60,5),(\'FOO00020\',\'RES00020\',45,0),(\'FOO00021\',\'RES00021\',70,5),(\'FOO00022\',\'RES00022\',140,0),(\'FOO00023\',\'RES00023\',220,10),(\'FOO00024\',\'RES00024\',200,0),(\'FOO00025\',\'RES00025\',150,0),(\'FOO00026\',\'RES00026\',120,5),(\'FOO00027\',\'RES00027\',40,0),(\'FOO00028\',\'RES00028\',200,10),(\'FOO00029\',\'RES00029\',70,5);')
    runQuery(callback, 'INSERT INTO service VALUES(\'GUI00001\',\'GUP00001\',1000,10),(\'GUI00002\',\'GUP00002\',1700,5),(\'GUI00003\',\'GUP00003\',2700,15),(\'GUI00004\',\'GUP00004\',1000,5),(\'GUI00005\',\'GUP00005\',2000,10),(\'GUI00006\',\'GUP00006\',1800,5),(\'GUI00007\',\'GUP00007\',1700,0),(\'GUI00008\',\'GUP00008\',1560,15),(\'GUI00009\',\'GUP00009\',1300,10),(\'GUI00010\',\'GUP00010\',1200,10),(\'GUI00011\',\'GUP00011\',1200,5),(\'GUI00012\',\'GUP00012\',1100,20),(\'GUI00013\',\'GUP00013\',1300,10),(\'GUI00014\',\'GUP00014\',1600,0),(\'GUI00015\',\'GUP00015\',7700,5),(\'GUI00016\',\'GUP00016\',6700,10),(\'GUI00017\',\'GUP00017\',4000,5),(\'GUI00018\',\'GUP00018\',3500,10),(\'GUI00019\',\'GUP00019\',5700,10),(\'GUI00020\',\'GUP00020\',5100,5),(\'GUI00021\',\'GUP00021\',500,10),(\'GUI00022\',\'GUP00022\',590,10);')
    runQuery(callback, 'INSERT INTO tourist_spot VALUES(\'TOR00001\',\'pangong lake\',\'LOC00000\',\'lake\',300),(\'TOR00002\',\'Zanskar Valley\',\'LOC00001\',\'Valley\',400),(\'TOR00003\',\'Tso Moriri\',\'LOC00002\',\'lake\',400),(\'TOR00004\',\'Ladakh\',\'LOC00003\',\'trekking, snow\',500),(\'TOR00005\',\'Leh\',\'LOC00004\',\'trekking,snow\',500),(\'TOR00006\',\'Srinagar\',\'LOC00005\',\'trekking snow\',500),(\'TOR00007\',\'Dal Lake\',\'LOC00006\',\'Lake\',500),(\'TOR00008\',\'Shalimar Bagh\',\'LOC00007\',\'shopping\',400),(\'TOR00009\',\'Shimla\',\'LOC00008\',\'side seeing, snowfall\',400),(\'TOR00010\',\'Rishikesh\',\'LOC00019\',\'center for studying yoga and meditation\',400),(\'TOR00011\',\'Badrinath\',\'LOC00010\',\'religious place\',400),(\'TOR00012\',\'Haridwar\',\'LOC00011\',\'river junction and visiting ganga\',300),(\'TOR00013\',\'Amritsar\',\'LOC00012\',\'visiting various gurdwaras\',400),(\'TOR00014\',\'Golden Temple\',\'LOC00013\',\'sikhs gurudwara religious \',500),(\'TOR00015\',\'Wagah Border\',\'LOC00014\',\'Border\',400),(\'TOR00016\',\'Delhi\',\'LOC00015\',\'visiting various monuments and fast life\',500),(\'TOR00017\',\'Red Fort\',\'LOC00016\',\'Fort\',400),(\'TOR00018\',\'Qutub Minar\',\'LOC00017\',\'Minar\',300),(\'TOR00019\',\'India Gate\',\'LOC00018\',\'Gate\',400),(\'TOR00020\',\'Jodhpur\',\'LOC00019\',\'museum for paintings, old historical guns\',300),(\'TOR00021\',\'Agra\',\'LOC00020\',\'museums and monuments\',400),(\'TOR00022\',\'Fatehpur Sikri\',\'LOC00021\',\'Sikri\',300),(\'TOR00023\',\'Agra Fort\',\'LOC00022\',\'Fort\',300),(\'TOR00024\',\'Shivpui\',\'LOC00023\',\'monuments\',200),(\'TOR00025\',\'Sanchi \',\'LOC00024\',\'budha sculptures\',300),(\'TOR00026\',\'Kanha National Park\',\'LOC00025\',\'park\',400),(\'TOR00027\',\'Mount Abu\',\'LOC00026\',\'hill station\',300),(\'TOR00028\',\'Abu Road\',\'LOC00027\',\'Road\',100),(\'TOR00029\',\'Gir National Park\',\'LOC00028\',\'park\',400),(\'TOR00030\',\'Mumbai\',\'LOC00029\',\'gateway of india\',500),(\'TOR00031\',\'Navi Mumbai\',\'LOC00030\',\'fast life and beach\',400),(\'TOR00032\',\'Marine Drive\',\'LOC00031\',\'beach\',500),(\'TOR00033\',\'Ellora Caves\',\'LOC00032\',\'Caves\',400),(\'TOR00034\',\'Ajanta Caves\',\'LOC00033\',\'Caves\',400),(\'TOR00035\',\'Panjim\',\'LOC00034\',\'beach\',400),(\'TOR00036\',\'Calangute\',\'LOC00035\',\'beach\',500),(\'TOR00037\',\'Vijaypura\',\'LOC00036\',\'food binge city\',400),(\'TOR00038\',\'Hampi\',\'LOC00037\',\'group of monuments\',300),(\'TOR00039\',\'Hydrabad\',\'LOC00038\',\'fort and palace\',200),(\'TOR00040\',\'Vishakhapatnam\',\'LOC00039\',\'indian coastal services\',300),(\'TOR00041\',\'Shillong\',\'LOC00040\',\'hill station\',400),(\'TOR00042\',\'Kaziranga\',\'LOC00041\',\'park\',100);')
    runQuery(callback, 'INSERT INTO hotel VALUES(\'HOT00001\',\'LOC00004\',\'Y\'),(\'HOT00002\',\'LOC00004\',\'Y\'),(\'HOT00003\',\'LOC00004\',\'Y\'),(\'HOT00004\',\'LOC00003\',\'Y\'),(\'HOT00005\',\'LOC00005\',\'Y\'),(\'HOT00006\',\'LOC00003\',\'Y\'),(\'HOT00007\',\'LOC00005\',\'Y\'),(\'HOT00008\',\'LOC00008\',\'N\'),(\'HOT00009\',\'LOC00011\',\'Y\'),(\'HOT00010\',\'LOC00012\',\'Y\'),(\'HOT00011\',\'LOC00015\',\'Y\'),(\'HOT00012\',\'LOC00019\',\'Y\'),(\'HOT00013\',\'LOC00020\',\'Y\'),(\'HOT00014\',\'LOC00023\',\'Y\'),(\'HOT00016\',\'LOC00029\',\'Y\'),(\'HOT00017\',\'LOC00038\',\'Y\'),(\'HOT00019\',\'LOC00040\',\'Y\'),(\'HOT00020\',\'LOC00020\',\'Y\'),(\'HOT00022\',\'LOC00015\',\'Y\'),(\'HOT00023\',\'LOC00020\',\'N\'),(\'HOT00025\',\'LOC00029\',\'Y\'),(\'HOT00026\',\'LOC00008\',\'Y\'),(\'HOT00027\',\'LOC00008\',\'Y\'),(\'HOT00028\',\'LOC00019\',\'N\'),(\'HOT00029\',\'LOC00038\',\'Y\'),(\'HOT00030\',\'LOC00009\',\'Y\'),(\'HOT00031\',\'LOC00003\',\'Y\'),(\'HOT00032\',\'LOC00002\',\'N\'),(\'HOT00033\',\'LOC00023\',\'Y\'),(\'HOT00034\',\'LOC00005\',\'Y\'),(\'HOT00035\',\'LOC00004\',\'Y\'),(\'HOT00036\',\'LOC00010\',\'N\'),(\'HOT00037\',\'LOC00011\',\'Y\'),(\'HOT00038\',\'LOC00012\',\'Y\'),(\'HOT00039\',\'LOC00015\',\'Y\'),(\'HOT00040\',\'LOC00018\',\'Y\'),(\'HOT00041\',\'LOC00020\',\'Y\'),(\'HOT00042\',\'LOC00021\',\'Y\'),(\'HOT00044\',\'LOC00022\',\'Y\'),(\'HOT00045\',\'LOC00018\',\'Y\');')
    runQuery(callback, 'INSERT INTO room VALUES(\'ROO00001\',\'single\',1),(\'ROO00002\',\'double\',2),(\'ROO00003\',\'family suite\',4),(\'ROO00004\',\'triple\',3),(\'ROO00005\',\'double\',2),(\'ROO00006\',\'single\',1),(\'ROO00007\',\'family suite\',4),(\'ROO00008\',\'double\',2),(\'ROO00009\',\'single\',1),(\'ROO00010\',\'single\',1),(\'ROO00011\',\'family suite\',4),(\'ROO00012\',\'double\',2),(\'ROO00013\',\'triple\',3),(\'ROO00014\',\'single\',1),(\'ROO00016\',\'double\',2),(\'ROO00017\',\'single\',1),(\'ROO00019\',\'single\',1),(\'ROO00020\',\'family suite\',4),(\'ROO00022\',\'triple\',3),(\'ROO00023\',\'single\',1),(\'ROO00025\',\'family suite\',4),(\'ROO00026\',\'double\',2),(\'ROO00027\',\'single\',1),(\'ROO00028\',\'triple\',3),(\'ROO00029\',\'family suite\',4),(\'ROO00030\',\'family suite\',4),(\'ROO00031\',\'single\',1),(\'ROO00032\',\'double\',2),(\'ROO00033\',\'double\',2),(\'ROO00034\',\'single\',1),(\'ROO00035\',\'family suite\',4),(\'ROO00036\',\'double\',2),(\'ROO00037\',\'single\',1),(\'ROO00038\',\'single\',1),(\'ROO00039\',\'double\',2),(\'ROO00040\',\'family suite\',4),(\'ROO00041\',\'single\',1),(\'ROO00042\',\'single\',1),(\'ROO00044\',\'single\',1),(\'ROO00045\',\'double\',2);')
    runQuery(callback, 'INSERT INTO flight VALUES(\'FLI00000\',\'Delhi\',\'Mumbai\',\'2020-01-02 10:10:10\',\'2020-01-02 12:10:10\'), (\'FLI00001\',\'Delhi\',\'Junagadh\',\'2020-01-03 11:10:10\',\'2020-01-03 12:10:10\'),(\'FLI00002\',\'Delhi\',\'Shivpuri\',\'2020-01-03 09:10:11\',\'2020-01-03 10:10:10\'),(\'FLI00003\',\'Delhi\',\'Raisen\',\'2020-01-04 08:10:00\',\'2020-01-04 11:30:10\'),(\'FLI00004\',\'Delhi\',\'Amritsar\',\'2020-01-05 04:10:00\',\'2020-01-05 08:10:10\'),(\'FLI00005\',\'Goa\',\'Delhi\',\'2020-01-06 05:10:10\',\'2020-01-06 09:10:10\'),(\'FLI00006\',\'Goa\',\'Mumbai\',\'2020-01-07 07:10:00\',\'2020-01-07 10:10:10\'),(\'FLI00007\',\'Goa\',\'Agra\',\'2020-01-08 07:10:10\',\'2020-01-08 11:10:10\'),(\'FLI00008\',\'Agra\',\'Delhi\',\'2020-01-09 02:10:00\',\'2020-01-09 09:10:10\'),(\'FLI00009\',\'Goa\',\'Delhi\',\'2020-01-10 01:10:10\',\'2020-01-10 09:10:10\'),(\'FLI00010\',\'Haridwar\',\'Delhi\',\'2020-01-01 03:10:00\',\'2020-01-01 09:10:10\'),(\'FLI00011\',\'Delhi\',\'Sirohi\',\'2020-01-10 05:10:10\',\'2020-01-10 09:10:10\'),(\'FLI00012\',\'Aurangabad\',\'Mumbai\',\'2020-01-01 07:10:00\',\'2020-01-01 09:10:10\'),(\'FLI00014\',\'North Panji\',\'Goa\',\'2020-01-09 09:10:10\',\'2020-01-09 10:30:10\');')
    runQuery(callback, 'INSERT INTO restaurant VALUES(\'RES00001\',\'LOC00004\',\'Y\',\'north indian\'),(\'RES00002\',\'LOC00003\',\'Y\',\'south indian\'),(\'RES00003\',\'LOC00005\',\'Y\',\'chinese\'),(\'RES00004\',\'LOC00008\',\'Y\',\'mughlai\'),(\'RES00005\',\'LOC00011\',\'Y\',\'italian\'),(\'RES00006\',\'LOC00008\',\'Y\',\'continental\'),(\'RES00007\',\'LOC00012\',\'Y\',\'american\'),(\'RES00008\',\'LOC00015\',\'Y\',\'greek\'),(\'RES00009\',\'LOC00019\',\'N\',\'british\'),(\'RES00010\',\'LOC00020\',\'N\',\'french\'),(\'RES00011\',\'LOC00019\',\'Y\',\'south indian\'),(\'RES00012\',\'LOC00023\',\'Y\',\'north indian\'),(\'RES00013\',\'LOC00029\',\'N\',\'north indian\'),(\'RES00014\',\'LOC00038\',\'Y\',\'chinese\'),(\'RES00015\',\'LOC00039\',\'N\',\'mughlai\'),(\'RES00016\',\'LOC00040\',\'N\',\'south indian\'),(\'RES00017\',\'LOC00020\',\'Y\',\'north indian\'),(\'RES00018\',\'LOC00015\',\'N\',\'north indian\'),(\'RES00019\',\'LOC00020\',\'Y\',\'italian\'),(\'RES00020\',\'LOC00008\',\'Y\',\'continental\'),(\'RES00021\',\'LOC00019\',\'Y\',\'north indian\'),(\'RES00022\',\'LOC00038\',\'Y\',\'north indian\'),(\'RES00023\',\'LOC00003\',\'Y\',\'american\'),(\'RES00024\',\'LOC00012\',\'Y\',\'greek\'),(\'RES00025\',\'LOC00004\',\'Y\',\'north indian\'),(\'RES00026\',\'LOC00005\',\'Y\',\'french\'),(\'RES00027\',\'LOC00003\',\'Y\',\'chinese\'),(\'RES00028\',\'LOC00020\',\'Y\',\'mughlai\'),(\'RES00029\',\'LOC00040\',\'Y\',\'italian\');')
    runQuery(callback, 'INSERT INTO food_item VALUES(\'FOO00001\',\'Dal Makhni\',\'north indian\'),(\'FOO00002\',\'Dosa\',\'south indian\'),(\'FOO00003\',\'Hakka Noodles\',\'chinese\'),(\'FOO00004\',\'Butter Chicken\',\'mughlai\'),(\'FOO00005\',\'Cheese Pizza\',\'italian\'),(\'FOO00006\',\'Bagels\',\'continental\'),(\'FOO00007\',\'French Toast\',\'american\'),(\'FOO00008\',\'Amygdalota\',\'greek\'),(\'FOO00009\',\'Bread\',\'british\'),(\'FOO00010\',\'French Toast\',\'french\'),(\'FOO00011\',\'Masala Dosa\',\'south indian\'),(\'FOO00012\',\'Malai Kofta\',\'north indian\'),(\'FOO00013\',\'Malai Kofta\',\'north indian\'),(\'FOO00014\',\'Tomato Soup\',\'chinese\'),(\'FOO00015\',\'Tandoori Chicken\',\'mughlai\'),(\'FOO00016\',\'Idli\',\'south indian\'),(\'FOO00017\',\'Aloo Gobhi\',\'north indian\'),(\'FOO00018\',\'Aloo Matar\',\'north indian\'),(\'FOO00019\',\'Margherita\',\'italian\'),(\'FOO00020\',\'Aloo Tikki Burger\',\'continental\'),(\'FOO00021\',\'Bhindi\',\'north indian\'),(\'FOO00022\',\'Ghiya\',\'north indian\'),(\'FOO00023\',\'Waffle\',\'american\'),(\'FOO00024\',\'Baklava\',\'greek\'),(\'FOO00025\',\'Malai Kofta\',\'north indian\'),(\'FOO00026\',\'Croissant\',\'french\'),(\'FOO00027\',\'Momos\',\'chinese\'),(\'FOO00028\',\'Butter chicken\',\'mughlai\'),(\'FOO00029\',\'Farmhouse Pizza\',\'italian\');')
    runQuery(callback, 'INSERT INTO taxi VALUES(\'TAX00001\',\'ciaz\',4,\'Y\'),(\'TAX00002\',\'ritz\',4,\'N\'),(\'TAX00003\',\'bmw\',4,\'Y\'),(\'TAX00004\',\'swift\',4,\'Y\'),(\'TAX00005\',\'ciaz\',4,\'Y\'),(\'TAX00006\',\'scorpio\',7,\'Y\'),(\'TAX00007\',\'ertiga\',7,\'Y\'),(\'TAX00008\',\'maruti Eeco\',6,\'N\'),(\'TAX00009\',\'i10\',4,\'Y\'),(\'TAX00010\',\'xuv\',4,\'Y\');')
    runQuery(callback, 'INSERT INTO route VALUES(\'BUS00001\',\'LOC00000\',\'12:00:00\'),(\'BUS00002\',\'LOC00001\',\'05:00:00\'),(\'BUS00003\',\'LOC00002\',\'06:00:00\'),(\'BUS00004\',\'LOC00003\',\'08:00:00\'),(\'BUS00005\',\'LOC00004\',\'01:00:00\'),(\'BUS00006\',\'LOC00005\',\'21:00:00\'),(\'BUS00007\',\'LOC00006\',\'05:00:00\'),(\'BUS00008\',\'LOC00007\',\'09:00:00\'),(\'BUS00009\',\'LOC00008\',\'07:00:00\'),(\'BUS00010\',\'LOC00009\',\'01:00:00\'),(\'BUS00011\',\'LOC00010\',\'04:00:00\'),(\'BUS00012\',\'LOC00011\',\'05:00:00\'),(\'BUS00013\',\'LOC00012\',\'02:00:00\'),(\'BUS00014\',\'LOC00013\',\'06:00:00\'),(\'BUS00015\',\'LOC00014\',\'01:00:00\'),(\'BUS00016\',\'LOC00015\',\'04:00:00\'),(\'BUS00017\',\'LOC00016\',\'02:00:00\'),(\'BUS00018\',\'LOC00017\',\'03:00:00\'),(\'BUS00019\',\'LOC00018\',\'09:00:00\'),(\'BUS00020\',\'LOC00019\',\'07:00:00\'),(\'BUS00021\',\'LOC00020\',\'02:00:00\'),(\'FLI00000\',\'LOC00021\',\'05:00:00\'),(\'FLI00001\',\'LOC00022\',\'02:00:00\'),(\'FLI00002\',\'LOC00023\',\'06:00:00\'),(\'FLI00003\',\'LOC00024\',\'12:00:00\'),(\'FLI00004\',\'LOC00025\',\'03:30:00\'),(\'FLI00005\',\'LOC00026\',\'01:45:00\'),(\'FLI00006\',\'LOC00027\',\'21:50:00\'),(\'FLI00007\',\'LOC00028\',\'15:45:00\'),(\'FLI00008\',\'LOC00029\',\'02:50:00\'),(\'FLI00009\',\'LOC00030\',\'20:45:00\'),(\'FLI00010\',\'LOC00031\',\'04:00:00\'),(\'FLI00011\',\'LOC00032\',\'06:00:00\'),(\'FLI00012\',\'LOC00033\',\'02:00:00\'),(\'FLI00014\',\'LOC00034\',\'01:45:00\'),(\'TAX00001\',\'LOC00036\',\'02:35:00\'),(\'TAX00002\',\'LOC00037\',\'03:45:00\'),(\'TAX00003\',\'LOC00038\',\'08:50:00\'),(\'TAX00004\',\'LOC00039\',\'07:45:00\'),(\'TAX00005\',\'LOC00040\',\'11:20:00\'),(\'TAX00006\',\'LOC00001\',\'12:00:00\'),(\'TAX00007\',\'LOC00002\',\'12:00:00\'),(\'TAX00008\',\'LOC00003\',\'12:00:00\'),(\'TAX00009\',\'LOC00004\',\'12:00:00\'),(\'TAX00010\',\'LOC00005\',\'12:00:00\'),(\'TRA00001\',\'LOC00006\',\'12:00:00\'),(\'TRA00002\',\'LOC00007\',\'12:00:00\'),(\'TRA00003\',\'LOC00008\',\'12:00:00\'),(\'TRA00004\',\'LOC00009\',\'12:00:00\'),(\'TRA00005\',\'LOC00010\',\'12:00:00\'),(\'TRA00006\',\'LOC00011\',\'12:00:00\'),(\'TRA00007\',\'LOC00012\',\'12:00:00\'),(\'TRA00008\',\'LOC00013\',\'12:00:00\'),(\'TRA00009\',\'LOC00014\',\'12:00:00\'),(\'TRA00010\',\'LOC00015\',\'12:00:00\'),(\'TRA00011\',\'LOC00016\',\'12:00:00\'),(\'TRA00012\',\'LOC00017\',\'12:00:00\'),(\'TRA00013\',\'LOC00018\',\'12:00:00\'),(\'TRA00014\',\'LOC00019\',\'12:00:00\'),(\'TRA00015\',\'LOC00020\',\'12:00:00\'),(\'TRA00016\',\'LOC00021\',\'12:00:00\');')
    runQuery(callback, 'INSERT INTO guide VALUES(\'GUI00001\',\'TOR00001\'),(\'GUI00002\',\'TOR00002\'),(\'GUI00003\',\'TOR00003\'),(\'GUI00004\',\'TOR00004\'),(\'GUI00005\',\'TOR00005\'),(\'GUI00006\',\'TOR00006\'),(\'GUI00007\',\'TOR00007\'),(\'GUI00008\',\'TOR00008\'),(\'GUI00009\',\'TOR00009\'),(\'GUI00010\',\'TOR00010\'),(\'GUI00011\',\'TOR00011\'),(\'GUI00012\',\'TOR00012\'),(\'GUI00013\',\'TOR00013\'),(\'GUI00014\',\'TOR00014\'),(\'GUI00015\',\'TOR00015\'),(\'GUI00016\',\'TOR00016\'),(\'GUI00017\',\'TOR00017\'),(\'GUI00018\',\'TOR00018\'),(\'GUI00019\',\'TOR00019\'),(\'GUI00020\',\'TOR00020\'),(\'GUI00021\',\'TOR00021\'),(\'GUI00022\',\'TOR00022\');')
    runQuery(callback, 'INSERT INTO trip VALUES(\'TRP00001\',\'USR00000\',\'2019-1-3\',\'2019-1-13\',\'ladakh\'),(\'TRP00002\',\'USR00002\',\'2020-2-14\',\'2020-2-27\',\'ladakh\'),(\'TRP00003\',\'USR00012\',\'2019-3-31\',\'2019-4-13\',\'ladakh\'),(\'TRP00004\',\'USR00012\',\'2019-4-20\',\'2019-4-30\',\'J&K\'),(\'TRP00005\',\'USR00012\',\'2019-5-3\',\'2019-5-13\',\'J&K\'),(\'TRP00006\',\'USR00012\',\'2019-5-20\',\'2019-5-28\',\'Srinagar\'),(\'TRP00007\',\'USR00012\',\'2019-6-1\',\'2019-6-13\',\'Srinagar\'),(\'TRP00008\',\'USR00012\',\'2019-6-3\',\'2019-7-20\',\'Srinagar\'),(\'TRP00009\',\'USR00012\',\'2019-7-19\',\'2019-7-29\',\'Shimla\'),(\'TRP00010\',\'USR00012\',\'2019-7-30\',\'2019-8-30\',\'Dehradun\'),(\'TRP00011\',\'USR00012\',\'2019-9-12\',\'2019-9-22\',\'chamoli\'),(\'TRP00012\',\'USR00012\',\'2019-11-23\',\'2019-12-1\',\'Haridwar\');')
    runQuery(callback, 'INSERT INTO service_request VALUES(\'RST00001\',\'TRP00001\',\'BUS00011\',\'2020-01-01 10:10:10\',8,8000,\"Pending\",4,5,\'nice service\'),(\'RST00002\',\'TRP00002\',\'FOO00004\',\'2020-01-01 10:10:10\',4,4000,\"Accepted\",5,5,\'excelent service\'),(\'RST00003\',\'TRP00003\',\'FLI00005\',\'2020-01-01 10:10:10\',5,5000,\"Completed\",4,4,\'nice experience\'),(\'RST00004\',\'TRP00004\',\'TAX00005\',\'2020-01-01 10:10:10\',4,4000,\"paid\",4,4,\'good service\'),(\'RST00005\',\'TRP00005\',\'ROO00005\',\'2020-01-01 10:10:10\',5,5000,\"Pending\",4,5,\'neat and clean hotel\'),(\'RST00006\',\'TRP00006\',\'TRA00015\',\'2020-01-01 10:10:10\',4,3000,\"Accepted\",4,5,\'average experience\'),(\'RST00007\',\'TRP00007\',\'BUS00007\',\'2020-01-01 10:10:10\',4,2500,\"Completed\",5,5,\'good experience\'),(\'RST00008\',\'TRP00008\',\'TAX00009\',\'2020-01-01 10:10:10\',4,5000,\"Rejected\",4,4,\'good service\'),(\'RST00009\',\'TRP00009\',\'FOO00013\',\'2020-01-01 10:10:10\',1,2000,\"Pending\",3,4,\'delicious food\'),(\'RST00010\',\'TRP00010\',\'ROO00002\',\'2020-01-01 10:10:10\',2,2500,\"Accepted\",5,5,\'neat and clean hotel\'),(\'RST00011\',\'TRP00011\',\'ROO00009\',\'2020-01-01 10:10:10\',7,8000,\"Completed\",4,4,\'nice hotel\'),(\'RST00012\',\'TRP00012\',\'TAX00006\',\'2020-01-01 10:10:10\',4,4000,\"Rejected\",5,5,\'good service\');')
    runQuery(callback, 'INSERT INTO query VALUES(\'QRY00001\',\'USR00000\',\'is there any smoking room In hotel ?\'),(\'QRY00002\',\'USR00001\',\'Can you make sea food on special demand ?\'),(\'QRY00003\',\'USR00002\',\'What is the last time we can report before the flight ?\'),(\'QRY00004\',\'USR00003\',\'Can I change my destination 2 times ?\'),(\'QRY00005\',\'USR00004\',\'Can I book more than 2 seats on one identity card? \'),(\'QRY00006\',\'USR00005\',\'Can I travel with my pet dog ?\'),(\'QRY00007\',\'USR00006\',\'Is there any female guide ?\'),(\'QRY00008\',\'USR00007\',\'Will there be 2 bathroom ?\'),(\'QRY00009\',\'USR00008\',\'Whether they use garlic or not ?\'),(\'QRY00010\',\'USR00009\',\'is there swimming pool in your hotel ?\'),(\'QRY00011\',\'USR00010\',\'do you accept online payment ?\'),(\'QRY00012\',\'USR00011\',\'Can you make food on special demands ?\');')
    // runQuery(callback, 'INSERT INTO train VALUES(\'TRA00001\',\'LOC00005\',\'LOC00036\',\'YNYYNYY\',\'Y\'),(\'TRA00002\',\'LOC00009\',\'LOC00032\',\'YYNNYYY\',\'Y\'),(\'TRA00003\',\'LOC00004\',\'LOC00015\',\'YNYYNYY\',\'Y\'),(\'TRA00004\',\'LOC00011\',\'LOC00001\',\'YNYNYNY\',\'N\'),(\'TRA00005\',\'LOC00021\',\'LOC00002\',\'YNYNYNY\',\'Y\'),(\'TRA00006\',\'LOC00022\',\'LOC00033\',\'YNYNYNY\',\'Y\'),(\'TRA00007\',\'LOC00025\',\'LOC00002\',\'YNYNYNY\',\'N\'),(\'TRA00008\',\'LOC00035\',\'LOC00001\',\'YNYNYNY\',\'N\'),(\'TRA00009\',\'LOC00036\',\'LOC00015\',\'YNYNYNY\',\'N\'),(\'TRA00010\',\'LOC00037\',\'LOC00016\',\'YNYNYNY\',\'Y\'),(\'TRA00011\',\'LOC00001\',\'LOC00033\',\'YNYNYNY\',\'N\'),(\'TRA00012\',\'LOC00011\',\'LOC00020\',\'YNYNYNY\',\'N\'),(\'TRA00013\',\'LOC00001\',\'LOC00025\',\'YNYNYNY\',\'N\'),(\'TRA00014\',\'LOC00002\',\'LOC00034\',\'YNYNYNY\',\'N\'),(\'TRA00015\',\'LOC00025\',\'LOC00004\',\'YNYNYNY\',\'Y\'),(\'TRA00016\',\'LOC00015\',\'LOC00023\',\'YNYNYNY\',\'Y\');')
    // runQuery(callback, 'INSERT INTO bus VALUES(\'BUS00001\',\'LOC00031\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00002\',\'LOC00032\',\'LOC00007\',\'YYYNYNY\',\'Y\'),(\'BUS00003\',\'LOC00035\',\'LOC00005\',\'YNNNYNY\',\'Y\'),(\'BUS00004\',\'LOC00015\',\'LOC00030\',\'YNYYYNY\',\'Y\'),(\'BUS00005\',\'LOC00015\',\'LOC00026\',\'YNYNNNY\',\'Y\'),(\'BUS00006\',\'LOC00019\',\'LOC00030\',\'YNYNNYY\',\'Y\'),(\'BUS00007\',\'LOC00029\',\'LOC00033\',\'YNYNYNY\',\'Y\'),(\'BUS00008\',\'LOC00001\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00009\',\'LOC00018\',\'LOC00023\',\'YNYNYNY\',\'N\'),(\'BUS00010\',\'LOC00015\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00011\',\'LOC00016\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00012\',\'LOC00017\',\'LOC00011\',\'YNYNYNY\',\'Y\'),(\'BUS00013\',\'LOC00018\',\'LOC00003\',\'YNYNYNY\',\'N\'),(\'BUS00014\',\'LOC00015\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00015\',\'LOC00018\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00016\',\'LOC00033\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00017\',\'LOC00029\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00018\',\'LOC00008\',\'LOC00036\',\'YNYNYNY\',\'N\'),(\'BUS00019\',\'LOC00015\',\'LOC00005\',\'YNYNYNY\',\'Y\'),(\'BUS00020\',\'LOC00003\',\'LOC00037\',\'YNYNYNY\',\'N\'),(\'BUS00021\',\'LOC00009\',\'LOC00038\',\'YNYNYNY\',\'Y\');')
}

var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "lHyGk3wWaK",
  password: "IAahckiJYJ",
  database: "lHyGk3wWaK"
});

// var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     port:"3307",
//     password: "zzzz",
//     database: "dbms_project"
//   });

async function connect() {
    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected!');
    });
}

function runQuery(callback, query) {
    console.log("Query Run/ :"+query);
    result = con.query(query, function (err, result) {
        if (err)
        {
            console.log(err);
            callback(null);
            return;
        }
        if(callback!=null)
            callback(result);
    });
}

function insertIntoTable(callback,table_name, data) {
    query = 'insert into '+table_name+' values ('
    for(i = 0; i <tables[table_name].length;i++) {
        query += '\"'+data[tables[table_name][i]]+'\"';
        if(i != tables[table_name].length - 1)
            query += ', '
    }
    query += ');';
    console.log(query);
    runQuery(callback, query);
}

function selectAllFromTable(callback, table_name) {
    query = 'select * from ' + table_name + ';';
    runQuery(callback, query);
}

// Register
function register_user(callback,user) {
    insertIntoTable(callback,'user', user);
}
function register_service(callback,service_type,service)
{
    insertIntoTable('service', service);
    switch(service_type){
        case 'hotel':
            insertIntoTable(callback,'room', service);
            break;
        case 'restaurant':
            insertIntoTable(callback,'food_item', service);
            break;
        case 'airline':
            insertIntoTable(callback,'flight', service);
            break;
        case 'bus':
            insertIntoTable(callback,'bus', service);
            break;
        case 'train':
            insertIntoTable(callback,'train', service);
            break;
        case 'taxi':
            insertIntoTable(callback,'taxi', service);
            break;
    }
}
function register_service_provider(callback,service_provider) {
    if(service_provider['domain'] == 'hotel' | service_provider['domain'] == 'restaurant') {
        insertIntoTable('service_provider', service_provider);
        insertIntoTable(callback,service_provider['domain'], service_provider);
    }
    else{
        insertIntoTable(callback,'service_provider', service_provider);
    }
}
function register_administrator(callback,administrator) {
    insertIntoTable(callback,'administrator', administrator);
}

// Login
function login_user(callback, user_id) {
    query = 'select password from user where user_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_service_provider(callback, user_id) {
    query = 'select password from service_provider where service_provider_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_administrator(callback, user_id) {
    query = 'select password from administrator where admin_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}

// Deactivate or Remove
function deactivate_user(user) {
    runQuery(function(result){}, 'update user set active = \'N\' where user_id = ' + user_id + ';');
}
function deactivate_service_provider(service_provider_id) {
    runQuery(function(result){}, 'update service_provider set active = \'N\' where user_id = ' + user_id + ';');
}
function remove_administrator(service_provider_id) {
    runQuery(function(result){}, 'delete from service_provider where service_provider_id = ' + service_provider_id + ';');
}

// get locations matching the search
function getLocations(callback, attribute_values) {
    query= 'select * from location ' + whereClause(attribute_values) + ';';
    console.log(query);
    runQuery(callback,query);
}

// add new location to the table
function addLocation(callback,location) {
    insertIntoTable(callback,'location', location);
}

// Temporary function to supply the attributes
function assignAttributes(input_tables) {
    attribute_values = {}
    for(var j = 0; j < input_tables.length; ++ j) {
        for(i = 0; i < tables[input_tables[j]].length; ++ i) {
            attribute_values[input_tables[j] + '.' + tables[input_tables[j]][i]] = ['\'%\''];
        }
     
    }
    // console.log('available attributes: ');
    // console.log(attribute_values);
    return attribute_values;
}

// Make where clause condition statement from attribute values
function whereClause(attribute_values) {
    query = '';
    var att_no = 0
    for(var attribute in attribute_values) {
        query += attribute + ' like ' + attribute_values[attribute];
        if(att_no == Object.keys(attribute_values).length - 1) continue;
            query += ') and (';
        att_no ++;
    }
    // console.log(query);
    return query;
}

// Query service providers and services in general
function getGeneralServiceProviderAndService(callback, attribute_values, rating = 0) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['service_provider', 'service']);
    }
    query = 'select * ' + 'from service_provider, service where( (service_provider.active = \'Y\') and (service_provider.service_provider_id = service.service_provider_id) and (' + whereClause(attribute_values) +  ') and service.service_id in (select service_request.service_id from service_request group by(service_id) having avg(service_rating) >= ' + rating + '));'
    runQuery(callback, query);
}

// Query on a particular service provider and service based on the attributes
// No special queries for hotels, restaurants, guide required, this one satisfies all filters
function getParticularServiceProviderAndService(callback, service_provider, service, attribute_values, rating = 0) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['service_provider', 'service', service_provider, service]);
    }
    query = 'select * ' + 'from service_provider, service, ' + service_provider + ', ' + service + ' where( (service_provider.active = \'Y\') and (service_provider.service_provider_id = service.service_provider_id) and (service_provider.service_provider_id = ' + service_provider + '.service_provider_id' + ') and (service.service_id = ' + service + '.service_id' + ') and (' + whereClause(attribute_values) +  ') and service.service_id in (select service_id from service_request group by(service_id) having avg(rating) > ' + rating +'));'
    runQuery(callback, query);
}

// Get busses and trains from one location to another
function getBusTrain(callback, location1_id, location2_id, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['bus', 'train'])
    }
    query = '(select * from bus, route r1, route r2 where r1.service_id = bus.service_id and r2.service_id = bus.service_id and r1.location_id = ' + location1_id + ' and r2.location_id = ' + location2_id + ' and r1.arrival_time < r2.arrival_time  and (' + whereClause(attribute_values) + ')) union (select * from train, route r1, route r2 where r1.service_id = train.service_id and r2.service_id = train.service_id and r1.location_id = ' + location1_id + ' and r2.location_id = ' + location2_id + ' and r1.arrival_time < r2.arrival_time and (' + whereClause(attribute_values) + '));' 
    runQuery(callback, query);
}

// Get flights from one location id's city to another location id's city
async function getFlight(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['flight', 'service'])
    }
    query = 'select * from flight, service where ( service.service_id = flight.service_id) and (' + whereClause(attribute_values) + ');'
    return await runQuery(callback, query);
}

// Get a list of tourist spots that are in a city, only unvisited or both visited and unvisited
function getTouristSpots(callback, user_id, attribute_values, city, unvisited) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['tourist_spot'])
    }
    console.log(attribute_values);
    if(unvisited) {
        query = 'select * from tourist_spot, location where (tourist_spot_id not in (select tourist_spot_id from visited where user_id in ( select user_id from trip where trip_id = ' + trip_id +')) tourist_spot.location_id = location.location_id and location.city REGEXP '+ city + ') and (' + whereClause(attribute_values) + ');';
    } else {
        query = 'select * from tourist_spot, location where (tourist_spot.location_id = location.location_id and location.city REGEXP ' + city + ' ) and (' + whereClause(attribute_values) + ');';
    }
    console.log(query);
    runQuery(callback, query);
}

// Add tourist spot to wishlist
function addTouristSpotToWishlist(user_id, tourist_spot_id) {
    insertIntoTable('wishlist', {'user_id': user_id, 'tourist_spot_id': tourist_spot_id});
}

// Add tourist spot to visited 
function markTouristSpotVisited(trip_id, tourist_spot_id) {
    insertIntoTable('visited', {'trip_id': trip_id, 'tourist_spot_id': tourist_spot_id});
    runQuery(callback, 'delete from wishlist where user_id in (select user_id from trip where trip_id = ' + trip_id + ') and tourist_spot_id = ' + tourist_spot_id + ');')
}

// Filter trips (based on user_id and other attributes)
function getTrips(callback, attribute_values) {
    runQuery(callback, 'select * from trip where ' + whereClause(attribute_values) + ';');
}

// Request service
function requestService(service_request) {
    insertIntoTable('service_request', service_request);
}

// Update status by service_provider
function changeStatusOfServiceRequest(request_id, status) {
    runQuery(function(result){}, 'update service_request set status = ' + status + ' where request_id = ' + request_id + ';');
}

// Filter service requests availed by user
// Caller should make sure that user_id is the id of the user currently logged in 
// to ensure no user can view the service requests of any other user
function getServiceRequests(callback, user_id, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['service_request']);
    }
    runQuery(callback, 'select * from service_request where trip_id in (select trip_id from trip where trip.user_id = \"' + user_id +'\") and (' + whereClause(attribute_values) + ');');
}

function count_table(callback,table_name)
{
    query="select count(*) as cnt from "+table_name+";";
    runQuery(callback,query);
}
function getUserInfo(callback,uid)
{
    query="select * from user where user_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getAdminInfo(callback,uid)
{
    query="select * from administrator where admin_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getFoodItems(callback,filters)
{
    query=`
    select s.service_id,f.name,f.cuisine,s.price,s.discount,p.name as res_name,l.locality,l.city,r.delivers,
    (SELECT COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=s.service_id)  as rating 
    from food_item as f,service_provider as p,location as l, restaurant as r,service as s 
    where(
    f.service_id=s.service_id and 
    p.service_provider_id=s.service_provider_id and 
    r.service_provider_id=s.service_provider_id and 
    l.location_id=r.location_id and
    f.name like `+filters.name+` and p.name like `+filters.rest+` and r.delivers like `+filters.delivery+`);
    `
    runQuery(callback,query);
}
function getServiceReview(callback,service_id)
{
    query=`select u.name as user,r.timestamp,r.comments as body,r.user_rating as rating
    from user as u,service_request as r,trip as t
    where(u.user_id=t.user_id and r.trip_id=t.trip_id and r.service_id REGEXP "`+service_id+`");`;
    runQuery(callback,query);
}

function getTrips(callback,user_id)
{
    query=`select t.trip_id,u.user_id,t.departure_date,t.arrival_date,t.city
    from trip as t,user as u
    where(u.user_id=t.user_id and u.user_id REGEXP "`+user_id+`")
    ORDER BY t.departure_date;`
    runQuery(callback,query)
}


async function main() {
    console.log('Start serverjs');
    await connect();
    // createDatabase(function(){
    //     console.log('done Creation');
    // });
    console.log('done Connect');
    // console.log(await getFlight(callback, '\'LOC00015\'', '\'LOC00029\''));
    // getTouristSpots(function(result) {console.log(result)}, null, null, '\'Delhi\'', false);
    // getGeneralServiceProviderAndService(function(result){console.log(result)});
   
    // getLocations(function(result){
    //     console.log(result);
    // },{city:["\"Delhi\""]})
    // register_user(function(){
    //     console.log("insert Done");
    // },
    // {
    //     user_id:"USR00012",
    //     name:"Sudhir", 
    //     email:"asga@sd.com",
    //     password:"zzzz",
    //     address:"asag",
    //     phone_no:"1234567891",
    //     location_id:"LOC00001",
    //     active:"Y"
    // });
    // getTouristSpots();
}
main();


module.exports = {
    'tables' : tables,
    'createDatabase' : createDatabase,
    'insertIntoTable' : insertIntoTable,
    'selectAllFromTable' : selectAllFromTable,
    'register_user' : register_user,
    'register_service_provider' : register_service_provider,
    'register_service':register_service,
    'count_table':count_table,
    'register_administrator' : register_administrator,
    'login_user' : login_user,
    'login_service_provider' : login_service_provider,
    'login_administrator' : login_administrator,
    'deactivate_user' : deactivate_user,
    'deactivate_service_provider' : deactivate_service_provider,
    'remove_administrator' : remove_administrator, 
    'getLocations' : getLocations,
    'addLocation' : addLocation,
    'getGeneralServiceProviderAndService' : getGeneralServiceProviderAndService,
    'getParticularServiceProviderAndService' : getParticularServiceProviderAndService,
    'getBusTrain' : getBusTrain,
    'getFlight' : getFlight,
    'getTouristSpots' : getTouristSpots,
    'addTouristSpotToWishlist' : addTouristSpotToWishlist,
    'markTouristSpotVisited' : markTouristSpotVisited,
    'getTrips' : getTrips,
    'requestService' : requestService,
    'changeStatusOfServiceRequest' : changeStatusOfServiceRequest,
    'getServiceRequests' : getServiceRequests,
    'getUserInfo':getUserInfo,
    'getAdminInfo':getAdminInfo,
    'getFoodItems':getFoodItems,
    'getServiceReview':getServiceReview,
    'getTrips':getTrips
}
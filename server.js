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
    'train': ['service_id', 'from_location_id', 'to_location_id', 'active_days', 'AC'],
    'route': ['service_id', 'location_id', 'arrival_time'],
    'tourist_spot': ['tourist_spot_id', 'name', 'location_id', 'type', 'entry_fee'],
    'guide': ['service_id','name', 'tourist_spot_id'],
    'trip': ['trip_id','user_id','departure_date', 'return_date', 'destination_city'],
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
    runQuery(callback, 'drop table if exists train;')
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
    runQuery(callback, 'create table if not exists train(service_id char(8) primary key,from_location_id char(8),to_location_id char(8),active_days char(7),AC char(1),foreign key(service_id) references service(service_id),check (service_id like \"BUS%\"),foreign key(from_location_id) references location(location_id),foreign key(to_location_id) references location(location_id),check (active_days like \"[YN][YN][YN][YN][YN][YN][YN]\"),check (AC in (\"Y\", \"N\")));')
    runQuery(callback, 'create table if not exists route (service_id char(8),location_id char(8),arrival_time time,primary key (service_id, location_id),foreign key(service_id) references service(service_id),foreign key(location_id) references location(location_id));')
    runQuery(callback, 'create table if not exists tourist_spot (tourist_spot_id char(8) primary key,name varchar(100),location_id char(8),type varchar(100),entry_fee float,foreign key(location_id) references location(location_id));')
    runQuery(callback, 'create table if not exists guide (service_id char(8) primary key,name varchar(100),tourist_spot_id char(8),foreign key(service_id) references service(service_id),check (service_id like \"GUI%\"),foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id));')
    runQuery(callback, 'create table if not exists trip (trip_id char(8) primary key,user_id char(8),departure_date date,return_date date,destination_city varchar(100),foreign key(user_id) references user(user_id));')
    runQuery(callback, 'create table if not exists service_request (request_id char(8) primary key,trip_id char(8),service_id char(8) not null,timestamp datetime,quantity int not null,cost int not null,status varchar(15) not null,user_rating int,service_rating int,comments varchar(1000),foreign key(trip_id) references trip(trip_id),foreign key(service_id) references service(service_id),check (status in (\"Pending\", \"Accepted\", \"Rejected\", \"Completed\", \"Paid\")),check (user_rating >= 0 and user_rating <= 5),check (service_rating >= 0 and service_rating <= 5));')
    runQuery(callback, 'create table if not exists query (query_id char(8), user_id char(8), query varchar(100),foreign key(user_id) references user(user_id));')
    runQuery(callback, 'create table if not exists wishlist (user_id char(8), tourist_spot_id char(8), primary key(user_id, tourist_spot_id), foreign key(user_id) references user(user_id), foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id))');
    runQuery(callback, 'create table if not exists visited (trip_id char(8), tourist_spot_id char(8), primary key(trip_id, tourist_spot_id), foreign key(trip_id) references trip(trip_id), foreign key(tourist_spot_id) references tourist_spot(tourist_spot_id))');

    
    runQuery(callback,'INSERT INTO location VALUES(\'LOC00000\',\'pangong lake\',\'ladakh\',\'J&K\',\'India\',194101),(\'LOC00001\',\'Zanskar Valley\',\'ladakh\',\'J&K\',\'India\',194102),(\'LOC00002\',\'Tso Moriri\',\'ladakh\',\'J&K\',\'India\',194103),(\'LOC00003\',\'Ladakh\',\'ladakh\',\'J&K\',\'India\',194101),(\'LOC00004\',\'Leh\',\'Leh\',\'J&K\',\'India\',194104),(\'LOC00005\',\'Srinagar\',\'Srinagar\',\'J&K\',\'India\',190001),(\'LOC00006\',\'Dal Lake\',\'Srinagar\',\'J&K\',\'India\',190002),(\'LOC00007\',\'Shalimar Bagh\',\'Srinagar\',\'J&K\',\'India\',190003),(\'LOC00008\',\'Shimla\',\'Shimla\',\'Himachal Pradesh\',\'India\',171001),(\'LOC00009\',\'Rishikesh\',\'Dehradun\',\'Uttrakhand\',\'India\',249201),(\'LOC00010\',\'Badrinath\',\'Chamoli\',\'Uttrakhand\',\'India\',249202),(\'LOC00011\',\'Haridwar\',\'Haridwar\',\'Uttrakhand\',\'India\',249401),(\'LOC00012\',\'Amritsar\',\'Amritsar\',\'Punjab\',\'India\',143001),(\'LOC00013\',\'Golden Temple\',\'Amritsar\',\'Punjab\',\'India\',143002),(\'LOC00014\',\'Wagah Border\',\'Amritsar\',\'Punjab\',\'India\',143003),(\'LOC00015\',\'Delhi\',\'Delhi \',\'Delhi\',\'India\',110000),(\'LOC00016\',\'Red Fort\',\'Delhi \',\'Delhi\',\'India\',110011),(\'LOC00017\',\'Qutub Minar\',\'Delhi \',\'Delhi\',\'India\',110054),(\'LOC00018\',\'India Gate\',\'Delhi \',\'Delhi\',\'India\',110024),(\'LOC00019\',\'Jodhpur\',\'Jodhpur\',\'Rajasthan\',\'India\',342154),(\'LOC00020\',\'Agra\',\'Agra \',\'Uttar Pradesh\',\'India\',234142),(\'LOC00021\',\'Fatehpur Sikri\',\'Agra \',\'Uttar Pradesh\',\'India\',334192),(\'LOC00022\',\'Agra Fort\',\'Agra \',\'Uttar Pradesh\',\'India\',334182),(\'LOC00023\',\'Shivpui\',\'Shivpuri\',\'Madhya Pradesh\',\'India\',473551),(\'LOC00024\',\'Sanchi \',\'Raisen\',\'Madhya Pradesh\',\'India\',482164),(\'LOC00025\',\'Kanha National Park\',\'Balaghat\',\'Madhya Pradesh\',\'India\',481001),(\'LOC00026\',\'Mount Abu\',\'Sirohi\',\'Rajasthan\',\'India\',307501),(\'LOC00027\',\'Abu Road\',\'Sirohi\',\'Rajasthan\',\'India\',307530),(\'LOC00028\',\'Gir National Park\',\'Junagadh\',\'Gujrat\',\'India\',362001),(\'LOC00029\',\'Mumbai\',\'Mumbai\',\'Maharashtra\',\'India\',400001),(\'LOC00030\',\'Navi Mumbai\',\'Thane\',\'Maharashtra\',\'India\',400002),(\'LOC00031\',\'Marine Drive\',\'Mumbai\',\'Maharashtra\',\'India\',400003),(\'LOC00032\',\'Ellora Caves\',\'Aurangabad\',\'Maharashtra\',\'India\',472164),(\'LOC00033\',\'Ajanta Caves\',\'Aurangabad\',\'Maharashtra\',\'India\',472178),(\'LOC00034\',\'Panjim\',\'Goa\',\'Goa\',\'India\',403001),(\'LOC00035\',\'Calangute\',\'North Panji\',\'Goa\',\'India\',403213),(\'LOC00036\',\'Vijaypura\',\'Bijapur\',\'Karnataka\',\'India\',586101),(\'LOC00037\',\'Hampi\',\'Ballari\',\'Karnataka\',\'India\',588101),(\'LOC00038\',\'Hydrabad\',\'Hydrabad\',\'Telangana\',\'India\',500512),(\'LOC00039\',\'Vishakhapatnam\',\'Vishakhapatnam\',\'Andhra Pradesh\',\'India\',530612),(\'LOC00040\',\'Shillong\',\'Shillong\',\'Meghalaya\',\'India\',634514),(\'LOC00041\',\'Kaziranga\',\'Karbi Anglong\',\'Assam\',\'India\',612414),(\'LOC00042\',\'Chennai\',\'Chennai\',\'Tamil Nadu\',\'India\',600001),(\'LOC00043\',\'Vadodara\',\'Vadodara\',\'Gujarat\',\'India\',390007),(\'LOC00044\',\'Ahmedabad\',\'Ahmedabad\',\'Gujarat\',\'India\',380001),(\'LOC00045\',\'Bangalore\',\'Bangalore\',\'Karnataka\',\'India\',560008),(\'LOC00046\',\'Kolkata\',\'Kolkata\',\'West Bengal\',\'India\',700019),(\'LOC00047\',\'Pune\',\'Pune\',\'Maharashtra\',\'India\',411014),(\'LOC00048\',\'Hydrabad\',\'Hyderabad\',\'Telangana\',\'India\',500003),(\'LOC00049\',\'dadar\',\'Mumbai\',\'Maharashtra\',\'India\',400002),(\'LOC00050\',\'ambala\',\'haryana\',\'Haryana\',\'India\',400003),(\'LOC00051\',\'jalandahar\',\'punjab\',\'punjab\',\'India\',400008),(\'LOC00052\',\'kashi\',\'Varanasi\',\'Uttar Pradesh\',\'India\',334172),(\'LOC00053\',\'Udhagamandalam\',\'Nilgri\',\'Tamil Nadu\',\'India\',600002),(\'LOC00054\',\'Tirumala Tirupati Balaji Temple\',\'Tirupati\',\'Andhra Pradesh\',\'India\',530602),(\'LOC00055\',\'Munar\',\'Madhurai\',\'kerala\',\'India\',408415),(\'LOC00056\',\'shirdi\',\'Mumbai\',\'Maharashtra\',\'India\',411015),(\'LOC00057\',\'Alleppey\',\'kerala\',\'kerala\',\'India\',502416),(\'LOC00058\',\'Darjeeling\',\'Bengal\',\'Bengal\',\'India\',700018),(\'LOC00059\',\'Rameshwaram\',\'Tamil Nadu\',\'Tamil Nadu\',\'India\',600003),(\'LOC00060\',\'Pondicherry \',\'Chennai\',\'Chennai\',\'India\',600008),(\'LOC00061\',\'Puri\',\'Bay of Bengal\',\'odisha\',\'India\',100008),(\'LOC00062\',\'kovalam\',\'kerala\',\'kerala\',\'India\',206417),(\'LOC00063\',\'Kodaikanal\',\'Tamil Nadu\',\'Tamil Nadu\',\'India\',600004),(\'LOC00064\',\'Thekaddy\',\'kerala\',\'kerala\',\'India\',206418),(\'LOC00065\',\'Khajuraho \',\'Madhya Pradesh\',\'Madhya Paradesh\',\'India\',473451),(\'LOC00066\',\'Kaziranga \',\'Assam\',\'Assam\',\'India\',612415),(\'LOC00067\',\'Chikmagalur\',\'Karnataka\',\'Karnataka\',\'India\',560007),(\'LOC00068\',\'Sabarimala\',\'kerala\',\'kerala\',\'India\',402419),(\'LOC00069\',\'konark\',\'Bay of Bengal\',\'odisha\',\'India\',100009),(\'LOC00070\',\'Dharmshala\',\'Himachal Pradesh\',\'Himachal Pradesh\',\'India\',171002);')
    runQuery(callback,'INSERT INTO User VALUES(\'USR00000\',\'Neeraf \',\'Neeraf@432gmail.com.com\',\'Nera333\',\'138, Angappa Naicken St, Parrys Chennai, Tamil Nadu, 600001',4425229885,'LOC00042\',\'Y\'),(\'USR00001\',\'Ekambar \',\'Ekambar@109yahoo.com\',\'pyasf3333\',\'M 9, Part 1, Greater Kailash Delhi, Delhi, 110048',1129234950,'LOC00015\',\'Y\'),(\'USR00002\',\'Sankalpa \',\'Sankalpa@322yahoo.com\',\'pfasdre3333\',\'18/19, Alkapuri, 18/19, Alkapuri Vadodara, Gujarat, 390007',2652337966,'LOC00043\',\'Y\'),(\'USR00003\',\'Fatik \',\'Fatik@41gmail.com\',\'pyarsdfae33\',\'136, Narayan Dhuru Street, Masjid Bunder Mumbai, Maharashtra, 400003',2223450058,'LOC00029\',\'Y\'),(\'USR00004\',\'Shashimohan \',\'Shashimohan@12gmail.com\',\'pyargf3333\',\'Shop No 9, Stn, Nr Silky, Santacruz (west) Mumbai, Maharashtra, 400054',2226052751,'LOC00029\',\'Y\'),(\'USR00005\',\'Bhuvanesh\',\'Bhuvanesh@34gmail.com\',\'pyare33dsf33\',\'Shop No 6, D/14, Yogi Nagar, Eksar Road, Borivali (west) Mumbai, Maharashtra, 400091',3222898524,'LOC00029\',\'Y\'),(\'USR00006\',\'Tripurari \',\'Tripurari@24gmail.com\',\'pyare333dfs3\',\'21c, Pkt-3, Mig Flat, Mayur Vihar Delhi, Delhi, 110096',1122615327,'LOC00015\',\'Y\'),(\'USR00007\',\'Mangal \',\'mangal@238gmail.com\',\'pyare3fdsa333\',\'173, Sarvoday Comm Centre, Salapose Road, Nr Gpo, Ahmedabad, Gujarat, 380001',7925504021,'LOC00044\',\'Y\'),(\'USR00008\',\'Raghupati \',\'raghu@288gmail.com\',\'pyare3fd333\',\'36, 16th Cross C M H Road, Lakshmipuram, Ulsoor Bangalore, Karnataka, 560008',4425575389,'LOC00045\',\'Y\'),(\'USR00009\',\'Daiwik \',\'daiwik@277gmail.com\',\'pyare33df33\',\'Prasad Heights, 43 Somnath Nagar, Vadgaonsheri, Pune, Maharashtra, 411014',9242703174,'LOC00047\',\'Y\'),(\'USR00010\',\'Gagan\',\'gagan@266gmail.com\',\'pyare3df333\',\'167- P, Rashbehari Avenue, Ballygunj, Kolkata, West Bengal, 700019',8489245681,'LOC00046\',\'Y\'),(\'USR00011\',\'Jagadbandu \',\'jaga@254gmail.com\',\'jagaasasda\',\'84, Devloped Indl Estate, Perungudi, Chennai, Tamil Nadu, 600096',2684405124,'LOC00042\',\'Y\'),(\'USR00012\',\'Uday\',\'uday@244gmail.com\',\'uda234\',\'27, Heavy Water Colony, Chhani Jakat Naka, Vadodara, Gujarat, 390002',3424961708,'LOC00043\',\'Y\'),(\'USR00013\',\'Viswas \',\'viswas@2gmail.com\',\'viswasasdadada\',\'24 Temple Road, Agaram Chennai, Tamil Nadu, 600082',3525378703,'LOC00042\',\'Y\'),(\'USR00014\',\'Saket \',\'saket@21gmail.com\',\'saket67787777\',\'15 & 16, Richmond Town, Bangalore, Karnataka, 560025',8022220296,'LOC00045\',\'Y\'),(\'USR00015\',\'Jusal \',\'jusal@2454gmail.com\',\'jusal1231231\',\'5, 100 Ft Rd, Vysys Bank Colony, B T M Bangalore, Karnataka, 560076',8726687005,'LOC00045\',\'Y\'),(\'USR00016\',\'Kunjabihari \',\'kunj@2354gmail.com\',\'kunjklklklasdf\',\'22, Royapettah High Road, Royapettah, Chennai, Tamil Nadu, 600014',9721623577,'LOC00042\',\'Y\'),(\'USR00017\',\'Ottakoothan \',\'ottak@3435yahoo.com\',\'ottak1113\',\'1-8-303/69/3, S P Road, Hyderabad, Telangana, 500003',4428114197,'LOC00048\',\'Y\'),(\'USR00018\',\'Naval \',\'naval@234gmail.com\',\'naval1111\',\'1a Chirag Mansion, Khetwadi Back Rd, Khetwadi, Mumbai, Maharashtra, 400004',4027849319,'LOC00029\',\'Y\'),(\'USR00019\',\'Pyaremohan \',\'pyare@123gmail.com\',\'pyare3333\',\'420, Shri Ram Bhawan, Chandni Chowk Delhi, Delhi, 110006',1123928452,'LOC00015\',\'Y\');')
    runQuery(callback,'INSERT INTO Administrator VALUES(\'ADM00000\',\'vekine\',\'Admin\',\'vekine@gmail.com\',\'vekine123\'),(\'ADM00001\',\'Quest\',\'Service providers communications\',\'quet@gmail.com\',\'quet123\'),(\'ADM00002\',\'koneu\',\'Service providers communications\',\'koneu@gmail.com\',\'koeneu123\'),(\'ADM00003\',\'beqone\',\'Service providers communications\',\'bequone@gmail.com\',\'bequone123\'),(\'ADM00004\',\'Keao\',\'Statistician\',\'keao@gmail.com\',\'keao123\'),(\'ADM00005\',\'heotin\',\'Official Paperwork\',\'heotin@gmail.com\',\'heotin123\'),(\'ADM00006\',\'Joegit\',\'User Information handling\',\'joegit@gmail.com\',\'joegit123\'),(\'ADM00007\',\'vibege\',\'User Information handling\',\'vubege@gmail.com\',\'vubege123\'),(\'ADM00008\',\'lenyber\',\'Suggestions Implementation\',\'lenyber@gmail.com\',\'lenyber123\'),(\'ADM00009\',\'niceher\',\'Respondent for user queries\',\'niceher@gmail.com\',\'niceher123\'),(\'ADM00010\',\'sivepec\',\'Respondent for user queries\',\'sivepec@gmail.com\',\'sivepec123\'),(\'ADM00011\',\'jesotun\',\'Verification of guides\',\'jesotn@gmail.com\',\'jesotn123\'),(\'ADM00012\',\'pedakij\',\'Tourist Spots Verification\',\'pedakij@gmail.com\',\'pedakij123\'),(\'ADM00013\',\'zedart\',\'Tourist Spots Verification\',\'zedart0@gmail.com\',\'zedart0123\'),(\'ADM00014\',\'bali\',\'Editor\',\'bali@gmail.com\',\'bali123\'),(\'ADM00015\',\'baljik\',\'Editor\',\'baljik@gmail.com\',\'baljik123\'),(\'ADM00016\',\'hamy\',\'Verification of guides\',\'hamy@gmail.com\',\'hamy123\'),(\'ADM00017\',\'jamy\',\'Official Paperwork\',\'jamy@gmail.com\',\'jamy123\'),(\'ADM00018\',\'tomi\',\'Statistician\',\'tomi@gmail.com\',\'tomi123\'),(\'ADM00019\',\'gujak\',\'Statistician\',\'gujak@gmail.com\',\'gujak123\'),(\'ADM00020\',\'harmion\',\'Official Paperwork\',\'harmion@gmail.com\',\'harmion123\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'BPR00000\',\'kat\',\'kat345\',\'Bus Provider\',\'Y\'),(\'BPR00001\',\'tak\',\'tak345\',\'Bus Provider\',\'Y\'),(\'BPR00002\',\'sohail\',\'sohail345\',\'Bus Provider\',\'Y\'),(\'BPR00003\',\'mohan\',\'mohan345\',\'Bus Provider\',\'Y\'),(\'BPR00004\',\'sohan\',\'sohan345\',\'Bus Provider\',\'Y\'),(\'BPR00005\',\'rohan\',\'rohan345\',\'Bus Provider\',\'Y\'),(\'BPR00006\',\'bhol\',\'bhol345\',\'Bus Provider\',\'Y\'),(\'BPR00007\',\'dol\',\'dhol345\',\'Bus Provider\',\'Y\'),(\'BPR00008\',\'gol\',\'gol345\',\'Bus Provider\',\'Y\'),(\'BPR00009\',\'bol\',\'bol345\',\'Bus Provider\',\'Y\'),(\'BPR00010\',\'sop\',\'sop345\',\'Bus Provider\',\'Y\'),(\'BPR00011\',\'cop\',\'cop345\',\'Bus Provider\',\'Y\'),(\'BPR00012\',\'hanry\',\'hanry345\',\'Bus Provider\',\'Y\'),(\'BPR00013\',\'tom\',\'tom345\',\'Bus Provider\',\'Y\'),(\'BPR00014\',\'jerry\',\'jerry345\',\'Bus Provider\',\'Y\'),(\'BPR00015\',\'spider\',\'spider345\',\'Bus Provider\',\'Y\'),(\'BPR00016\',\'map\',\'map345\',\'Bus Provider\',\'Y\'),(\'BPR00017\',\'bat\',\'bat345\',\'Bus Provider\',\'Y\'),(\'BPR00018\',\'darry\',\'darry345\',\'Bus Provider\',\'Y\'),(\'BPR00019\',\'darfy\',\'darfy345\',\'Bus Provider\',\'Y\'),(\'BPR00020\',\'goryf\',\'goryf345\',\'Bus Provider\',\'Y\'),(\'BPR00021\',\'jokey\',\'jokey345\',\'Bus Provider\',\'Y\'),(\'BPR00022\',\'holli\',\'holli345\',\'Bus Provider\',\'Y\'),(\'BPR00023\',\'follo\',\'follo345\',\'Bus Provider\',\'Y\'),(\'BPR00024\',\'bonu\',\'bonu345\',\'Bus Provider\',\'Y\'),(\'BPR00025\',\'goldu\',\'goldu345\',\'Bus Provider\',\'Y\'),(\'BPR00026\',\'loadu\',\'loadu345\',\'Bus Provider\',\'Y\'),(\'BPR00027\',\'mogai\',\'mogai345\',\'Bus Provider\',\'Y\'),(\'BPR00028\',\'jobin\',\'jobin345\',\'Bus Provider\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'AIR00000\',\'fog\',\'fog456\',\'Airline\',\'Y\'),(\'AIR00001\',\'gol\',\'gol456\',\'Airline\',\'Y\'),(\'AIR00002\',\'sonu\',\'sonu456\',\'Airline\',\'Y\'),(\'AIR00003\',\'farry\',\'farry456\',\'Airline\',\'Y\'),(\'AIR00004\',\'hanti\',\'hanti456\',\'Airline\',\'Y\'),(\'AIR00005\',\'sot\',\'sot456\',\'Airline\',\'Y\'),(\'AIR00006\',\'ewi\',\'ewi456\',\'Airline\',\'Y\'),(\'AIR00007\',\'ftgf\',\'ftgf456\',\'Airline\',\'Y\'),(\'AIR00008\',\'goli\',\'goli456\',\'Airline\',\'Y\'),(\'AIR00009\',\'roli\',\'roli456\',\'Airline\',\'Y\'),(\'AIR00010\',\'doop\',\'doop456\',\'Airline\',\'Y\'),(\'AIR00011\',\'Vivanta\',\'Vivanta456\',\'Airline\',\'Y\'),(\'AIR00012\',\'oogy\',\'oogy456\',\'Airline\',\'Y\'),(\'AIR00013\',\'mooood\',\'mooood456\',\'Airline\',\'Y\'),(\'AIR00014\',\'vood\',\'vood456\',\'Airline\',\'Y\'),(\'AIR00015\',\'joof\',\'joof456\',\'Airline\',\'Y\'),(\'AIR00016\',\'gooj\',\'gooj456\',\'Airline\',\'Y\'),(\'AIR00017\',\'look\',\'look456\',\'Airline\',\'Y\'),(\'AIR00018\',\'goldy\',\'goldy456\',\'Airline\',\'Y\'),(\'AIR00019\',\'golden\',\'golden456\',\'Airline\',\'Y\'),(\'AIR00020\',\'hjkio\',\'hjkio456\',\'Airline\',\'Y\'),(\'AIR00021\',\'bhj\',\'bhj456\',\'Airline\',\'Y\'),(\'AIR00022\',\'bjka\',\'bjka456\',\'Airline\',\'Y\'),(\'AIR00023\',\'kkl\',\'kkl456\',\'Airline\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'TAP00000\',\'fsadf\',\'fsadf234\',\'Taxi Provider\',\'Y\'),(\'TAP00001\',\'asdf\',\'asdf234\',\'Taxi Provider\',\'Y\'),(\'TAP00002\',\'asdfe\',\'asdfe234\',\'Taxi Provider\',\'Y\'),(\'TAP00003\',\'ffd\',\'ffd234\',\'Taxi Provider\',\'Y\'),(\'TAP00004\',\'hgs\',\'hgs234\',\'Taxi Provider\',\'Y\'),(\'TAP00005\',\'fe\',\'fe234\',\'Taxi Provider\',\'Y\'),(\'TAP00006\',\'asdfg\',\'asdfg234\',\'Taxi Provider\',\'Y\'),(\'TAP00007\',\'sdfg\',\'sdfg234\',\'Taxi Provider\',\'Y\'),(\'TAP00008\',\'fdgds\',\'fdgds234\',\'Taxi Provider\',\'Y\'),(\'TAP00009\',\'daby\',\'daby234\',\'Taxi Provider\',\'Y\'),(\'TAP00010\',\'daiy\',\'daby234\',\'Taxi Provider\',\'Y\'),(\'TAP00011\',\'abs\',\'abs234\',\'Taxi Provider\',\'Y\'),(\'TAP00012\',\'bcd\',\'bcd234\',\'Taxi Provider\',\'Y\'),(\'TAP00013\',\'cde\',\'cde234\',\'Taxi Provider\',\'Y\'),(\'TAP00014\',\'def\',\'def234\',\'Taxi Provider\',\'Y\'),(\'TAP00015\',\'efg\',\'efg234\',\'Taxi Provider\',\'Y\'),(\'TAP00016\',\'fgh\',\'fgh234\',\'Taxi Provider\',\'Y\'),(\'TAP00017\',\'ghi\',\'ghi234\',\'Taxi Provider\',\'Y\'),(\'TAP00018\',\'hij\',\'hij234\',\'Taxi Provider\',\'Y\'),(\'TAP00019\',\'ijk\',\'ijk234\',\'Taxi Provider\',\'Y\'),(\'TAP00020\',\'jkl\',\'jkl234\',\'Taxi Provider\',\'Y\'),(\'TAP00021\',\'klm\',\'klm234\',\'Taxi Provider\',\'Y\'),(\'TAP00022\',\'lmn\',\'lmn234\',\'Taxi Provider\',\'Y\'),(\'TAP00023\',\'mno\',\'mno234\',\'Taxi Provider\',\'Y\'),(\'TAP00024\',\'nop\',\'nop234\',\'Taxi Provider\',\'Y\'),(\'TAP00025\',\'opq\',\'opq234\',\'Taxi Provider\',\'Y\'),(\'TAP00026\',\'pqr\',\'pqr234\',\'Taxi Provider\',\'Y\'),(\'TAP00027\',\'qrs\',\'qrs234\',\'Taxi Provider\',\'Y\'),(\'TAP00028\',\'rst\',\'rst234\',\'Taxi Provider\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'TRP00000\',\'dgy\',\'dgy567\',\'Train Provider\',\'Y\'),(\'TRP00001\',\'bruno\',\'bruno567\',\'Train Provider\',\'Y\'),(\'TRP00002\',\'hanrr\',\'hanrr567\',\'Train Provider\',\'Y\'),(\'TRP00003\',\'jacck\',\'jacck567\',\'Train Provider\',\'Y\'),(\'TRP00004\',\'kaf\',\'kaf567\',\'Train Provider\',\'Y\'),(\'TRP00005\',\'jaf\',\'jaf567\',\'Train Provider\',\'Y\'),(\'TRP00006\',\'daf\',\'daf567\',\'Train Provider\',\'Y\'),(\'TRP00007\',\'gah\',\'gah567\',\'Train Provider\',\'Y\'),(\'TRP00008\',\'hui\',\'hui567\',\'Train Provider\',\'Y\'),(\'TRP00009\',\'noody\',\'noody567\',\'Train Provider\',\'Y\'),(\'TRP00010\',\'truc\',\'truc567\',\'Train Provider\',\'Y\'),(\'TRP00011\',\'banc\',\'banc567\',\'Train Provider\',\'Y\'),(\'TRP00012\',\'hju\',\'hju567\',\'Train Provider\',\'Y\'),(\'TRP00013\',\'dfy\',\'dfy567\',\'Train Provider\',\'Y\'),(\'TRP00014\',\'dcv\',\'dcv567\',\'Train Provider\',\'Y\'),(\'TRP00015\',\'rty\',\'rty567\',\'Train Provider\',\'Y\'),(\'TRP00016\',\'kopp\',\'kopp567\',\'Train Provider\',\'Y\'),(\'TRP00017\',\'koppy\',\'koppy567\',\'Train Provider\',\'Y\'),(\'TRP00018\',\'kapu\',\'kapu567\',\'Train Provider\',\'Y\'),(\'TRP00019\',\'klop\',\'klop567\',\'Train Provider\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'RES00000\',\'gooby\',\'gooby789\',\'Restaurant\',\'Y\'),(\'RES00001\',\'comb\',\'comb789\',\'Restaurant\',\'Y\'),(\'RES00002\',\'bom\',\'bom789\',\'Restaurant\',\'Y\'),(\'RES00003\',\'tooop\',\'tooop789\',\'Restaurant\',\'Y\'),(\'RES00004\',\'gooory\',\'gooory789\',\'Restaurant\',\'Y\'),(\'RES00005\',\'suri\',\'suri789\',\'Restaurant\',\'Y\'),(\'RES00006\',\'sudi\',\'sudi789\',\'Restaurant\',\'Y\'),(\'RES00007\',\'gooku\',\'gooku789\',\'Restaurant\',\'Y\'),(\'RES00008\',\'dooku\',\'dooku789\',\'Restaurant\',\'Y\'),(\'RES00009\',\'rummy\',\'rummy789\',\'Restaurant\',\'Y\'),(\'RES00010\',\'bunny\',\'bunny789\',\'Restaurant\',\'Y\'),(\'RES00011\',\'goosy\',\'goosy789\',\'Restaurant\',\'Y\'),(\'RES00012\',\'sory\',\'sory789\',\'Restaurant\',\'Y\'),(\'RES00013\',\'dee\',\'dee789\',\'Restaurant\',\'Y\'),(\'RES00014\',\'bee\',\'bee789\',\'Restaurant\',\'Y\'),(\'RES00015\',\'gee\',\'gee789\',\'Restaurant\',\'Y\'),(\'RES00016\',\'gelu\',\'gelu789\',\'Restaurant\',\'Y\'),(\'RES00017\',\'abus\',\'abus789\',\'Restaurant\',\'Y\'),(\'RES00018\',\'smil\',\'smil789\',\'Restaurant\',\'Y\'),(\'RES00019\',\'adbdul\',\'adbdul789\',\'Restaurant\',\'Y\'),(\'RES00020\',\'vohn\',\'vohn789\',\'Restaurant\',\'Y\'),(\'RES00021\',\'vohmu\',\'vohmu789\',\'Restaurant\',\'Y\'),(\'RES00022\',\'choi\',\'vhoi789\',\'Restaurant\',\'Y\'),(\'RES00023\',\'fooky\',\'fooky789\',\'Restaurant\',\'Y\'),(\'RES00024\',\'gluudy\',\'gluudy789\',\'Restaurant\',\'Y\'),(\'RES00025\',\'hine\',\'hine789\',\'Restaurant\',\'Y\'),(\'RES00026\',\'bonyyy\',\'bonyyy789\',\'Restaurant\',\'Y\'),(\'RES00027\',\'dasyyyy\',\'dasyyyy789\',\'Restaurant\',\'Y\'),(\'RES00028\',\'chittt\',\'chittt789\',\'Restaurant\',\'Y\'),(\'RES00029\',\'loagyui\',\'loagyui789\',\'Restaurant\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'HOT00000\',\'vanyr\',\'vanyr55\',\'Hotel\',\'Y\'),(\'HOT00001\',\'vanyK\',\'vanyk55\',\'Hotel\',\'Y\'),(\'HOT00002\',\'fnaay\',\'fnaay55\',\'Hotel\',\'Y\'),(\'HOT00003\',\'hyi\',\'hyi55\',\'Hotel\',\'Y\'),(\'HOT00004\',\'chittt\',\'chittt55\',\'Hotel\',\'Y\'),(\'HOT00005\',\'rits\',\'rits55\',\'Hotel\',\'Y\'),(\'HOT00006\',\'chittt\',\'chittt55\',\'Hotel\',\'Y\'),(\'HOT00007\',\'dereee\',\'dereee55\',\'Hotel\',\'Y\'),(\'HOT00008\',\'wen1\',\'wen155\',\'Hotel\',\'Y\'),(\'HOT00009\',\'dttt\',\'dttt55\',\'Hotel\',\'Y\'),(\'HOT00010\',\'fog\',\'fog55\',\'Hotel\',\'Y\'),(\'HOT00011\',\'liion\',\'liion55\',\'Hotel\',\'Y\'),(\'HOT00012\',\'lion\',\'lion55\',\'Hotel\',\'Y\'),(\'HOT00013\',\'tigeey\',\'tigeey55\',\'Hotel\',\'Y\'),(\'HOT00014\',\'chini\',\'chinni\',\'Hotel\',\'Y\'),(\'HOT00015\',\'pini\',\'pini\',\'Hotel\',\'Y\'),(\'HOT00016\',\'jummy\',\'jummy\',\'Hotel\',\'Y\'),(\'HOT00017\',\'fuunaay\',\'fuunaay55\',\'Hotel\',\'Y\'),(\'HOT00018\',\'gout\',\'gout55\',\'Hotel\',\'Y\'),(\'HOT00019\',\'goat\',\'goat55\',\'Hotel\',\'Y\'),(\'HOT00020\',\'pub\',\'pub55\',\'Hotel\',\'Y\'),(\'HOT00021\',\'pab\',\'pab55\',\'Hotel\',\'Y\'),(\'HOT00022\',\'palu\',\'palu55\',\'Hotel\',\'Y\'),(\'HOT00023\',\'paly\',\'paly55\',\'Hotel\',\'Y\'),(\'HOT00024\',\'palt\',\'palt55\',\'Hotel\',\'Y\'),(\'HOT00025\',\'part\',\'part55\',\'Hotel\',\'Y\'),(\'HOT00026\',\'aly\',\'aly55\',\'Hotel\',\'Y\'),(\'HOT00027\',\'alyuni\',\'alyuni55\',\'Hotel\',\'Y\'),(\'HOT00028\',\'chungg\',\'chungg55\',\'Hotel\',\'Y\'),(\'HOT00029\',\'geek\',\'geek55\',\'Hotel\',\'Y\'),(\'HOT00030\',\'ofty\',\'ofty55\',\'Hotel\',\'Y\'),(\'HOT00031\',\'softy\',\'softy55\',\'Hotel\',\'Y\'),(\'HOT00032\',\'johmy\',\'johmy55\',\'Hotel\',\'Y\'),(\'HOT00033\',\'dopy\',\'dopy55\',\'Hotel\',\'Y\'),(\'HOT00034\',\'vog\',\'vog55\',\'Hotel\',\'Y\'),(\'HOT00035\',\'vol\',\'vol55\',\'Hotel\',\'Y\'),(\'HOT00036\',\'val\',\'val55\',\'Hotel\',\'Y\'),(\'HOT00037\',\'callyy\',\'callyy55\',\'Hotel\',\'Y\'),(\'HOT00038\',\'gooooooopy\',\'gooooooopy55\',\'Hotel\',\'Y\'),(\'HOT00039\',\'jakky \',\'jakky55\',\'Hotel\',\'Y\'),(\'HOT00040\',\'bolu \',\'bolu55\',\'Hotel\',\'Y\'),(\'HOT00041\',\'jaullyio \',\'jaullyio55\',\'Hotel\',\'Y\'),(\'HOT00042\',\'monvz \',\'monvz55\',\'Hotel\',\'Y\'),(\'HOT00043\',\'bnhuop\',\'bnhuop55\',\'Hotel\',\'Y\'),(\'HOT00044\',\'zcxvvb\',\'zcxvvb55\',\'Hotel\',\'Y\');')
    runQuery(callback,'INSERT INTO service_provider VALUES(\'GUP00000\',\'aquamann\',\'aquamann44\',\'Guide Provider\',\'Y\'),(\'GUP00001\',\'joks\',\'joks44\',\'Guide Provider\',\'Y\'),(\'GUP00002\',\'manup\',\'manup44\',\'Guide Provider\',\'Y\'),(\'GUP00003\',\'scuuby\',\'scuuby44\',\'Guide Provider\',\'Y\'),(\'GUP00004\',\'boof\',\'boof44\',\'Guide Provider\',\'Y\'),(\'GUP00005\',\'hell2\',\'hell244\',\'Guide Provider\',\'Y\'),(\'GUP00006\',\'hell1\',\'hell144\',\'Guide Provider\',\'Y\'),(\'GUP00007\',\'goog\',\'goog44\',\'Guide Provider\',\'Y\'),(\'GUP00008\',\'joffy\',\'joffy44\',\'Guide Provider\',\'Y\'),(\'GUP00009\',\'juney\',\'juney44\',\'Guide Provider\',\'Y\'),(\'GUP00010\',\'buney\',\'buney44\',\'Guide Provider\',\'Y\'),(\'GUP00011\',\'foggggggy\',\'foggggggy44\',\'Guide Provider\',\'Y\'),(\'GUP00012\',\'rabbit\',\'rabbit44\',\'Guide Provider\',\'Y\'),(\'GUP00013\',\'fooooogg\',\'fooooogg44\',\'Guide Provider\',\'Y\'),(\'GUP00014\',\'toyyyyy\',\'toyyyyy44\',\'Guide Provider\',\'Y\'),(\'GUP00015\',\'boooolu\',\'boooolu44\',\'Guide Provider\',\'Y\'),(\'GUP00016\',\'aqua\',\'aqua44\',\'Guide Provider\',\'Y\'),(\'GUP00017\',\'asfsaa\',\'asfsaa44\',\'Guide Provider\',\'Y\'),(\'GUP00018\',\'voif\',\'voif44\',\'Guide Provider\',\'Y\'),(\'GUP00019\',\'hojiji\',\'hojiji44\',\'Guide Provider\',\'Y\'),(\'GUP00020\',\'qubek\',\'qubek44\',\'Guide Provider\',\'Y\'),(\'GUP00021\',\'ebi\',\'ebi44\',\'Guide Provider\',\'Y\'),(\'GUP00022\',\'usiiii\',\'usiiii44\',\'Guide Provider\',\'Y\');')
    runQuery(callback,'INSERT INTO Service VALUES(\'BUS00000\',\'BPR00000\',4000,5),(\'BUS00001\',\'BPR00001\',2000,10),(\'BUS00002\',\'BPR00002\',6000,15),(\'BUS00003\',\'BPR00003\',7000,20),(\'BUS00004\',\'BPR00004\',3000,40),(\'BUS00005\',\'BPR00005\',4000,20),(\'BUS00006\',\'BPR00006\',8000,5),(\'BUS00007\',\'BPR00007\',5000,10),(\'BUS00008\',\'BPR00008\',4000,15),(\'BUS00009\',\'BPR00009\',5000,20),(\'BUS00010\',\'BPR00010\',6000,5),(\'BUS00011\',\'BPR00011\',5000,10),(\'BUS00012\',\'BPR00012\',4000,0),(\'BUS00013\',\'BPR00013\',8000,5),(\'BUS00014\',\'BPR00014\',2000,0),(\'BUS00015\',\'BPR00015\',2000,40),(\'BUS00016\',\'BPR00016\',2000,20),(\'BUS00017\',\'BPR00017\',2000,20),(\'BUS00018\',\'BPR00018\',5000,5),(\'BUS00019\',\'BPR00019\',4000,10),(\'BUS00020\',\'BPR00020\',3000,10),(\'BUS00021\',\'BPR00021\',3000,10),(\'BUS00022\',\'BPR00022\',3000,10),(\'BUS00023\',\'BPR00023\',3000,10),(\'BUS00024\',\'BPR00024\',3000,10),(\'BUS00025\',\'BPR00025\',3000,10),(\'BUS00026\',\'BPR00026\',3000,10),(\'BUS00027\',\'BPR00027\',3000,10),(\'BUS00028\',\'BPR00028\',3000,10);')
    runQuery(callback,'INSERT INTO service VALUES(\'FLI00000\',\'AIR00000\',6000,5),(\'FLI00001\',\'AIR00001\',3000,10),(\'FLI00002\',\'AIR00002\',4500,5),(\'FLI00003\',\'AIR00003\',5000,5),(\'FLI00004\',\'AIR00004\',10000,0),(\'FLI00005\',\'AIR00005\',6000,5),(\'FLI00006\',\'AIR00006\',5500,10),(\'FLI00007\',\'AIR00007\',6000,10),(\'FLI00008\',\'AIR00008\',6000,5),(\'FLI00009\',\'AIR00009\',7000,10),(\'FLI00010\',\'AIR00010\',7000,5),(\'FLI00011\',\'AIR00011\',12000,10),(\'FLI00012\',\'AIR00012\',6000,0),(\'FLI00013\',\'AIR00013\',6000,5),(\'FLI00014\',\'AIR00014\',6000,5),(\'FLI00015\',\'AIR00015\',6000,5),(\'FLI00016\',\'AIR00016\',6000,5),(\'FLI00017\',\'AIR00017\',6000,5),(\'FLI00018\',\'AIR00018\',6000,5),(\'FLI00019\',\'AIR00019\',6000,5),(\'FLI00020\',\'AIR00020\',6000,5),(\'FLI00021\',\'AIR00021\',6000,5),(\'FLI00022\',\'AIR00022\',6000,5),(\'FLI00023\',\'AIR00023\',6000,5);')
    runQuery(callback,'INSERT INTO service VALUES(\'ROO00000\',\'HOT00000\',1000,5),(\'ROO00001\',\'HOT00001\',2000,10),(\'ROO00002\',\'HOT00002\',4000,5),(\'ROO00003\',\'HOT00003\',3000,15),(\'ROO00004\',\'HOT00004\',2000,20),(\'ROO00005\',\'HOT00005\',1500,10),(\'ROO00006\',\'HOT00006\',2500,0),(\'ROO00007\',\'HOT00007\',3500,5),(\'ROO00008\',\'HOT00008\',2000,10),(\'ROO00009\',\'HOT00009\',1500,0),(\'ROO00010\',\'HOT00010\',5000,0),(\'ROO00011\',\'HOT00011\',2000,10),(\'ROO00012\',\'HOT00012\',3000,5),(\'ROO00013\',\'HOT00013\',800,10),(\'ROO00014\',\'HOT00014\',1500,20),(\'ROO00015\',\'HOT00015\',2000,10),(\'ROO00016\',\'HOT00016\',500,0),(\'ROO00017\',\'HOT00017\',4500,10),(\'ROO00018\',\'HOT00018\',3400,0),(\'ROO00019\',\'HOT00019\',5600,15),(\'ROO00020\',\'HOT00020\',2300,10),(\'ROO00021\',\'HOT00021\',10000,0),(\'ROO00022\',\'HOT00022\',5000,0),(\'ROO00023\',\'HOT00023\',2000,5),(\'ROO00024\',\'HOT00024\',8000,10),(\'ROO00025\',\'HOT00025\',1200,20),(\'ROO00026\',\'HOT00026\',1800,5),(\'ROO00027\',\'HOT00027\',3200,0),(\'ROO00028\',\'HOT00028\',4700,0),(\'ROO00029\',\'HOT00029\',3300,0),(\'ROO00030\',\'HOT00030\',5000,10),(\'ROO00031\',\'HOT00031\',4300,15),(\'ROO00032\',\'HOT00032\',3100,0),(\'ROO00033\',\'HOT00033\',2000,0),(\'ROO00034\',\'HOT00034\',3400,5),(\'ROO00035\',\'HOT00035\',2100,10),(\'ROO00036\',\'HOT00036\',2700,0),(\'ROO00037\',\'HOT00037\',2300,0),(\'ROO00038\',\'HOT00038\',2100,0),(\'ROO00039\',\'HOT00039\',2300,0),(\'ROO00040\',\'HOT00040\',2300,0),(\'ROO00041\',\'HOT00041\',2300,0),(\'ROO00042\',\'HOT00042\',2300,0),(\'ROO00043\',\'HOT00043\',2300,0),(\'ROO00044\',\'HOT00044\',2300,0);')
    runQuery(callback,'INSERT INTO Service VALUES(\'TAX00000\',\'TAP00000\',1500,5),(\'TAX00001\',\'TAP00001\',1200,0),(\'TAX00002\',\'TAP00002\',3000,10),(\'TAX00003\',\'TAP00003\',1500,10),(\'TAX00004\',\'TAP00004\',1600,5),(\'TAX00005\',\'TAP00005\',2200,10),(\'TAX00006\',\'TAP00006\',2000,10),(\'TAX00007\',\'TAP00007\',1800,5),(\'TAX00008\',\'TAP00008\',1200,0),(\'TAX00009\',\'TAP00009\',1500,10);')
    runQuery(callback,'INSERT INTO Service VALUES(\'TRA00000\',\'TRP00000\',8000,5),(\'TRA00001\',\'TRP00001\',4000,10),(\'TRA00002\',\'TRP00002\',5000,0),(\'TRA00003\',\'TRP00003\',6000,10),(\'TRA00004\',\'TRP00004\',7000,5),(\'TRA00005\',\'TRP00005\',4500,10),(\'TRA00006\',\'TRP00006\',5000,15),(\'TRA00007\',\'TRP00007\',6000,0),(\'TRA00008\',\'TRP00008\',8000,50),(\'TRA00009\',\'TRP00009\',7000,20),(\'TRA00010\',\'TRP00010\',6000,30),(\'TRA00011\',\'TRP00011\',4000,20),(\'TRA00012\',\'TRP00012\',8000,40),(\'TRA00013\',\'TRP00013\',9000,20),(\'TRA00014\',\'TRP00014\',10000,20),(\'TRA00015\',\'TRP00015\',5000,10);')
    runQuery(callback,'INSERT INTO Service VALUES(\'FOO00000\',\'RES00001\',200,0),(\'FOO00001\',\'RES00002\',40,0),(\'FOO00002\',\'RES00003\',250,5),(\'FOO00003\',\'RES00004\',180,10),(\'FOO00004\',\'RES00005\',350,0),(\'FOO00005\',\'RES00006\',50,0),(\'FOO00006\',\'RES00007\',80,5),(\'FOO00007\',\'RES00008\',320,15),(\'FOO00008\',\'RES00009\',60,20),(\'FOO00009\',\'RES00010\',80,0),(\'FOO00010\',\'RES00011\',300,0),(\'FOO00011\',\'RES00012\',250,0),(\'FOO00012\',\'RES00013\',180,0),(\'FOO00013\',\'RES00014\',120,5),(\'FOO00014\',\'RES00015\',300,10),(\'FOO00015\',\'RES00016\',350,10),(\'FOO00016\',\'RES00017\',400,15),(\'FOO00017\',\'RES00018\',200,5),(\'FOO00018\',\'RES00019\',60,5),(\'FOO00019\',\'RES00020\',45,0),(\'FOO00020\',\'RES00021\',70,5),(\'FOO00021\',\'RES00022\',140,0),(\'FOO00022\',\'RES00023\',220,10),(\'FOO00023\',\'RES00024\',200,0),(\'FOO00024\',\'RES00025\',150,0),(\'FOO00025\',\'RES00026\',120,5),(\'FOO00026\',\'RES00027\',40,0),(\'FOO00027\',\'RES00028\',200,10),(\'FOO00028\',\'RES00000\',1000,5),(\'FOO00029\',\'RES00001\',250,5),(\'FOO00030\',\'RES00012\',500,5),(\'FOO00031\',\'RES00013\',400,5),(\'FOO00032\',\'RES00017\',700,5),(\'FOO00033\',\'RES00018\',300,5),(\'FOO00034\',\'RES00021\',400,5),(\'FOO00035\',\'RES00022\',500,5),(\'FOO00036\',\'RES00025\',600,5),(\'FOO00037\',\'RES00001\',700,5),(\'FOO00038\',\'RES00012\',70,5),(\'FOO00039\',\'RES00013\',800,5),(\'FOO00040\',\'RES00017\',100,5),(\'FOO00041\',\'RES00018\',700,5),(\'FOO00042\',\'RES00021\',70,5),(\'FOO00043\',\'RES00022\',80,5),(\'FOO00044\',\'RES00025\',400,5),(\'FOO00045\',\'RES00001\',90,5),(\'FOO00046\',\'RES00012\',900,5),(\'FOO00047\',\'RES00013\',750,5),(\'FOO00048\',\'RES00017\',740,5),(\'FOO00049\',\'RES00018\',730,5),(\'FOO00050\',\'RES00002\',720,5),(\'FOO00051\',\'RES00011\',700,5),(\'FOO00052\',\'RES00016\',80,5),(\'FOO00053\',\'RES00002\',80,5),(\'FOO00054\',\'RES00011\',800,5),(\'FOO00055\',\'RES00016\',787,5),(\'FOO00056\',\'RES00002\',460,5),(\'FOO00057\',\'RES00011\',705,5),(\'FOO00058\',\'RES00016\',701,5),(\'FOO00059\',\'RES00002\',75,5),(\'FOO00060\',\'RES00011\',700,5),(\'FOO00061\',\'RES00016\',710,5),(\'FOO00062\',\'RES00002\',720,5),(\'FOO00063\',\'RES00011\',730,5),(\'FOO00064\',\'RES00016\',740,5),(\'FOO00065\',\'RES00002\',75,5),(\'FOO00066\',\'RES00011\',760,5),(\'FOO00067\',\'RES00016\',770,5),(\'FOO00068\',\'RES00002\',780,5),(\'FOO00069\',\'RES00003\',710,5),(\'FOO00070\',\'RES00014\',720,5),(\'FOO00071\',\'RES00027\',730,5),(\'FOO00072\',\'RES00003\',740,5),(\'FOO00073\',\'RES00014\',750,5),(\'FOO00074\',\'RES00027\',760,5),(\'FOO00075\',\'RES00003\',770,5),(\'FOO00076\',\'RES00014\',780,5),(\'FOO00077\',\'RES00027\',790,5),(\'FOO00078\',\'RES00003\',710,5),(\'FOO00079\',\'RES00014\',80,5),(\'FOO00080\',\'RES00027\',810,5),(\'FOO00081\',\'RES00003\',820,5),(\'FOO00082\',\'RES00014\',830,5),(\'FOO00083\',\'RES00003\',710,5),(\'FOO00084\',\'RES00014\',700,5),(\'FOO00085\',\'RES00027\',750,5),(\'FOO00086\',\'RES00003\',710,5),(\'FOO00087\',\'RES00014\',720,5),(\'FOO00088\',\'RES00027\',730,5),(\'FOO00089\',\'RES00003\',740,5),(\'FOO00090\',\'RES00014\',750,5),(\'FOO00091\',\'RES00004\',760,5),(\'FOO00092\',\'RES00015\',770,5),(\'FOO00093\',\'RES00028\',780,5),(\'FOO00094\',\'RES00004\',790,5),(\'FOO00095\',\'RES00015\',700,5),(\'FOO00096\',\'RES00028\',700,5),(\'FOO00097\',\'RES00004\',70,5),(\'FOO00098\',\'RES00015\',700,5),(\'FOO00099\',\'RES00028\',70,5),(\'FOO00100\',\'RES00004\',700,5),(\'FOO00101\',\'RES00015\',701,5),(\'FOO00102\',\'RES00028\',702,5),(\'FOO00103\',\'RES00004\',740,5),(\'FOO00104\',\'RES00015\',750,5),(\'FOO00105\',\'RES00028\',70,5),(\'FOO00106\',\'RES00004\',80,5),(\'FOO00107\',\'RES00015\',90,5),(\'FOO00108\',\'RES00028\',50,5),(\'FOO00109\',\'RES00005\',60,5),(\'FOO00110\',\'RES00019\',20,5),(\'FOO00111\',\'RES00000\',200,5),(\'FOO00112\',\'RES00005\',720,5),(\'FOO00113\',\'RES00019\',60,5),(\'FOO00114\',\'RES00000\',40,5),(\'FOO00115\',\'RES00005\',30,5),(\'FOO00116\',\'RES00019\',90,5),(\'FOO00117\',\'RES00000\',30,5),(\'FOO00118\',\'RES00005\',20,5),(\'FOO00119\',\'RES00019\',70,5),(\'FOO00120\',\'RES00029\',820,5),(\'FOO00121\',\'RES00005\',720,5),(\'FOO00122\',\'RES00019\',750,5),(\'FOO00123\',\'RES00000\',40,5),(\'FOO00124\',\'RES00005\',770,5),(\'FOO00125\',\'RES00019\',550,5),(\'FOO00126\',\'RES00006\',660,5),(\'FOO00127\',\'RES00020\',590,5),(\'FOO00128\',\'RES00006\',100,5),(\'FOO00129\',\'RES00020\',700,5),(\'FOO00130\',\'RES00006\',70,5),(\'FOO00131\',\'RES00020\',700,5),(\'FOO00132\',\'RES00006\',700,5),(\'FOO00133\',\'RES00020\',100,5),(\'FOO00134\',\'RES00006\',50,5),(\'FOO00135\',\'RES00020\',720,5),(\'FOO00136\',\'RES00006\',730,5),(\'FOO00137\',\'RES00020\',740,5),(\'FOO00138\',\'RES00006\',750,5),(\'FOO00139\',\'RES00020\',760,5),(\'FOO00140\',\'RES00006\',770,5),(\'FOO00141\',\'RES00020\',780,5),(\'FOO00142\',\'RES00006\',790,5),(\'FOO00143\',\'RES00020\',800,5),(\'FOO00144\',\'RES00006\',810,5),(\'FOO00145\',\'RES00020\',610,5),(\'FOO00146\',\'RES00006\',670,5),(\'FOO00147\',\'RES00020\',670,5),(\'FOO00148\',\'RES00006\',570,5),(\'FOO00149\',\'RES00020\',570,5),(\'FOO00150\',\'RES00007\',470,5),(\'FOO00151\',\'RES00023\',470,5),(\'FOO00152\',\'RES00007\',570,5),(\'FOO00153\',\'RES00023\',370,5),(\'FOO00154\',\'RES00007\',370,5),(\'FOO00155\',\'RES00023\',270,5),(\'FOO00156\',\'RES00007\',270,5),(\'FOO00157\',\'RES00023\',170,5),(\'FOO00158\',\'RES00007\',170,5),(\'FOO00159\',\'RES00023\',70,5),(\'FOO00160\',\'RES00007\',970,5),(\'FOO00161\',\'RES00023\',970,5),(\'FOO00162\',\'RES00007\',870,5),(\'FOO00163\',\'RES00023\',870,5),(\'FOO00164\',\'RES00007\',770,5),(\'FOO00165\',\'RES00023\',770,5),(\'FOO00166\',\'RES00007\',770,5),(\'FOO00167\',\'RES00023\',760,5),(\'FOO00168\',\'RES00007\',706,5),(\'FOO00169\',\'RES00023\',706,5),(\'FOO00170\',\'RES00007\',570,5),(\'FOO00171\',\'RES00023\',470,5),(\'FOO00172\',\'RES00007\',370,5),(\'FOO00173\',\'RES00023\',270,5),(\'FOO00174\',\'RES00007\',170,5),(\'FOO00175\',\'RES00023\',70,5),(\'FOO00176\',\'RES00007\',170,5),(\'FOO00177\',\'RES00008\',1170,5),(\'FOO00178\',\'RES00024\',1070,5),(\'FOO00179\',\'RES00008\',470,5),(\'FOO00180\',\'RES00024\',970,5),(\'FOO00181\',\'RES00008\',170,5),(\'FOO00182\',\'RES00024\',270,5),(\'FOO00183\',\'RES00008\',370,5),(\'FOO00184\',\'RES00024\',470,5),(\'FOO00185\',\'RES00008\',570,5),(\'FOO00186\',\'RES00024\',670,5),(\'FOO00187\',\'RES00008\',770,5),(\'FOO00188\',\'RES00024\',870,5),(\'FOO00189\',\'RES00008\',970,5),(\'FOO00190\',\'RES00009\',170,5),(\'FOO00191\',\'RES00009\',270,5),(\'FOO00192\',\'RES00009\',370,5),(\'FOO00193\',\'RES00009\',740,5),(\'FOO00194\',\'RES00009\',750,5),(\'FOO00195\',\'RES00009\',760,5),(\'FOO00196\',\'RES00009\',770,5),(\'FOO00197\',\'RES00009\',780,5),(\'FOO00198\',\'RES00009\',790,5),(\'FOO00199\',\'RES00009\',710,5),(\'FOO00200\',\'RES00010\',720,5),(\'FOO00201\',\'RES00026\',720,5),(\'FOO00202\',\'RES00010\',730,5),(\'FOO00203\',\'RES00026\',710,5),(\'FOO00204\',\'RES00010\',790,5),(\'FOO00205\',\'RES00026\',70,5),(\'FOO00206\',\'RES00010\',750,5),(\'FOO00207\',\'RES00026\',740,5),(\'FOO00208\',\'RES00010\',70,5),(\'FOO00209\',\'RES00026\',20,5);')
    runQuery(callback,'INSERT INTO service VALUES(\'GUI00000\',\'GUP00001\',1000,10),(\'GUI00001\',\'GUP00002\',1700,5),(\'GUI00002\',\'GUP00003\',2700,15),(\'GUI00003\',\'GUP00004\',1000,5),(\'GUI00004\',\'GUP00005\',2000,10),(\'GUI00005\',\'GUP00006\',1800,5),(\'GUI00006\',\'GUP00007\',1700,0),(\'GUI00007\',\'GUP00008\',1560,15),(\'GUI00008\',\'GUP00009\',1300,10),(\'GUI00009\',\'GUP00010\',1200,10),(\'GUI00010\',\'GUP00011\',1200,5),(\'GUI00011\',\'GUP00012\',1100,20),(\'GUI00012\',\'GUP00013\',1300,10),(\'GUI00013\',\'GUP00014\',1600,0),(\'GUI00014\',\'GUP00015\',7700,5),(\'GUI00015\',\'GUP00016\',6700,10),(\'GUI00016\',\'GUP00017\',4000,5),(\'GUI00017\',\'GUP00018\',3500,10),(\'GUI00018\',\'GUP00019\',5700,10),(\'GUI00019\',\'GUP00020\',5100,5),(\'GUI00020\',\'GUP00021\',500,10),(\'GUI00021\',\'GUP00022\',590,10);')
    runQuery(callback,'INSERT INTO Tourist_Spot VALUES(\'TOR00000\',\'pangong lake\',\'LOC00000\',\'lake\',300),(\'TOR00001\',\'Zanskar Valley\',\'LOC00001\',\'Valley\',400),(\'TOR00002\',\'Tso Moriri\',\'LOC00002\',\'lake\',400),(\'TOR00003\',\'Ladakh\',\'LOC00003\',\'trekking snow\',500),(\'TOR00004\',\'Leh\',\'LOC00004\',\'trekking,snow\',500),(\'TOR00005\',\'Srinagar\',\'LOC00005\',\'trekking snow\',500),(\'TOR00006\',\'Dal Lake\',\'LOC00006\',\'Lake\',500),(\'TOR00007\',\'Shalimar Bagh\',\'LOC00007\',\'shopping\',400),(\'TOR00008\',\'Shimla\',\'LOC00008\',\'side seeing, snowfall\',400),(\'TOR00009\',\'Rishikesh\',\'LOC00019\',\'center for studying yoga and meditation\',400),(\'TOR00010\',\'Badrinath\',\'LOC00010\',\'religious place\',400),(\'TOR00011\',\'Haridwar\',\'LOC00011\',\'river junction and visiting ganga\',300),(\'TOR00012\',\'Amritsar\',\'LOC00012\',\'visiting various gurdwaras\',400),(\'TOR00013\',\'Golden Temple\',\'LOC00013\',\'sikhs gurudwara religious \',500),(\'TOR00014\',\'Wagah Border\',\'LOC00014\',\'Border\',400),(\'TOR00015\',\'Delhi\',\'LOC00015\',\'visiting various monuments and fast life\',500),(\'TOR00016\',\'Red Fort\',\'LOC00016\',\'Fort\',400),(\'TOR00017\',\'Qutub Minar\',\'LOC00017\',\'Minar\',300),(\'TOR00018\',\'India Gate\',\'LOC00018\',\'Gate\',400),(\'TOR00019\',\'Jodhpur\',\'LOC00019\',\'museum for paintings, old historical guns\',300),(\'TOR00020\',\'Agra\',\'LOC00020\',\'museums and monuments\',400),(\'TOR00021\',\'Fatehpur Sikri\',\'LOC00021\',\'Sikri\',300),(\'TOR00022\',\'Agra Fort\',\'LOC00022\',\'Fort\',300),(\'TOR00023\',\'Shivpui\',\'LOC00023\',\'monuments\',200),(\'TOR00024\',\'Sanchi \',\'LOC00024\',\'budha sculptures\',300),(\'TOR00025\',\'Kanha National Park\',\'LOC00025\',\'park\',400),(\'TOR00026\',\'Mount Abu\',\'LOC00026\',\'hill station\',300),(\'TOR00027\',\'Abu Road\',\'LOC00027\',\'Road\',100),(\'TOR00028\',\'Gir National Park\',\'LOC00028\',\'park\',400),(\'TOR00029\',\'Mumbai\',\'LOC00029\',\'gateway of india\',500),(\'TOR00030\',\'Navi Mumbai\',\'LOC00030\',\'fast life and beach\',400),(\'TOR00031\',\'Marine Drive\',\'LOC00031\',\'beach\',500),(\'TOR00032\',\'Ellora Caves\',\'LOC00032\',\'Caves\',400),(\'TOR00033\',\'Ajanta Caves\',\'LOC00033\',\'Caves\',400),(\'TOR00034\',\'Panjim\',\'LOC00034\',\'beach\',400),(\'TOR00035\',\'Calangute\',\'LOC00035\',\'beach\',500),(\'TOR00036\',\'Vijaypura\',\'LOC00036\',\'food binge city\',400),(\'TOR00037\',\'Hampi\',\'LOC00037\',\'group of monuments\',300),(\'TOR00038\',\'Hydrabad\',\'LOC00038\',\'fort and palace\',200),(\'TOR00039\',\'Vishakhapatnam\',\'LOC00039\',\'indian coastal services\',300),(\'TOR00040\',\'Shillong\',\'LOC00040\',\'hill station\',400),(\'TOR00041\',\'Kaziranga\',\'LOC00041\',\'park\',100);')
    runQuery(callback,'INSERT INTO hotel VALUES(\'HOT00000\',\'LOC00004\',\'Y\'),(\'HOT00001\',\'LOC00004\',\'Y\'),(\'HOT00002\',\'LOC00004\',\'Y\'),(\'HOT00003\',\'LOC00003\',\'Y\'),(\'HOT00004\',\'LOC00005\',\'Y\'),(\'HOT00005\',\'LOC00003\',\'Y\'),(\'HOT00006\',\'LOC00005\',\'Y\'),(\'HOT00007\',\'LOC00008\',\'N\'),(\'HOT00008\',\'LOC00011\',\'Y\'),(\'HOT00009\',\'LOC00012\',\'Y\'),(\'HOT00010\',\'LOC00015\',\'Y\'),(\'HOT00011\',\'LOC00019\',\'Y\'),(\'HOT00012\',\'LOC00020\',\'Y\'),(\'HOT00013\',\'LOC00023\',\'Y\'),(\'HOT00014\',\'LOC00029\',\'Y\'),(\'HOT00015\',\'LOC00038\',\'Y\'),(\'HOT00016\',\'LOC00040\',\'Y\'),(\'HOT00017\',\'LOC00020\',\'Y\'),(\'HOT00018\',\'LOC00015\',\'Y\'),(\'HOT00019\',\'LOC00020\',\'N\'),(\'HOT00020\',\'LOC00029\',\'Y\'),(\'HOT00021\',\'LOC00008\',\'Y\'),(\'HOT00022\',\'LOC00008\',\'Y\'),(\'HOT00023\',\'LOC00019\',\'N\'),(\'HOT00024\',\'LOC00038\',\'Y\'),(\'HOT00025\',\'LOC00009\',\'Y\'),(\'HOT00026\',\'LOC00003\',\'Y\'),(\'HOT00027\',\'LOC00002\',\'N\'),(\'HOT00028\',\'LOC00023\',\'Y\'),(\'HOT00029\',\'LOC00005\',\'Y\'),(\'HOT00030\',\'LOC00004\',\'Y\'),(\'HOT00031\',\'LOC00010\',\'N\'),(\'HOT00032\',\'LOC00011\',\'Y\'),(\'HOT00033\',\'LOC00012\',\'Y\'),(\'HOT00034\',\'LOC00015\',\'Y\'),(\'HOT00035\',\'LOC00018\',\'Y\'),(\'HOT00036\',\'LOC00020\',\'Y\'),(\'HOT00037\',\'LOC00021\',\'Y\'),(\'HOT00038\',\'LOC00022\',\'Y\'),(\'HOT00039\',\'LOC00018\',\'Y\');')
    runQuery(callback,'INSERT INTO Room VALUES(\'ROO00000\',\'single\',1),(\'ROO00001\',\'double\',2),(\'ROO00002\',\'family suite\',4),(\'ROO00003\',\'triple\',3),(\'ROO00004\',\'double\',2),(\'ROO00005\',\'single\',1),(\'ROO00006\',\'family suite\',4),(\'ROO00007\',\'double\',2),(\'ROO00008\',\'single\',1),(\'ROO00009\',\'single\',1),(\'ROO00010\',\'family suite\',4),(\'ROO00011\',\'double\',2),(\'ROO00012\',\'triple\',3),(\'ROO00013\',\'single\',1),(\'ROO00014\',\'double\',2),(\'ROO00015\',\'single\',1),(\'ROO00016\',\'single\',1),(\'ROO00017\',\'family suite\',4),(\'ROO00018\',\'triple\',3),(\'ROO00019\',\'single\',1),(\'ROO00020\',\'family suite\',4),(\'ROO00021\',\'double\',2),(\'ROO00022\',\'single\',1),(\'ROO00023\',\'triple\',3),(\'ROO00024\',\'family suite\',4),(\'ROO00025\',\'family suite\',4),(\'ROO00026\',\'single\',1),(\'ROO00027\',\'double\',2),(\'ROO00028\',\'double\',2),(\'ROO00029\',\'single\',1),(\'ROO00030\',\'family suite\',4),(\'ROO00031\',\'double\',2),(\'ROO00032\',\'single\',1),(\'ROO00033\',\'single\',1),(\'ROO00034\',\'double\',2),(\'ROO00035\',\'family suite\',4),(\'ROO00036\',\'single\',1),(\'ROO00037\',\'single\',1),(\'ROO00038\',\'single\',1),(\'ROO00039\',\'double\',2);')
    runQuery(callback,'INSERT INTO flight VALUES(\'FLI00000\',\'Delhi\',\'Mumbai\',\'2020-01-02 10:10:10\',\'2020-01-02 12:10:10\'),(\'FLI00001\',\'Delhi\',\'Junaghad\',\'2020-01-03 11:10:10\',\'2020-01-03 12:10:10\'),(\'FLI00002\',\'Delhi\',\'Shivpui\',\'2020-01-03 09:10:11\',\'2020-01-03 10:10:10\'),(\'FLI00003\',\'Delhi\',\'Raisen\',\'2020-01-04 08:10:00\',\'2020-01-04 11:30:10\'),(\'FLI00004\',\'Delhi\',\'Amritsar\',\'2020-01-05 04:10:00\',\'2020-01-05 08:10:10\'),(\'FLI00005\',\'Goa\',\'Delhi\',\'2020-01-06 05:10:10\',\'2020-01-06 09:10:10\'),(\'FLI00006\',\'Goa\',\'Mumbai\',\'2020-01-07 07:10:00\',\'2020-01-07 10:10:10\'),(\'FLI00007\',\'Goa\',\'Agra\',\'2020-01-08 07:10:10\',\'2020-01-08 11:10:10\'),(\'FLI00008\',\'Agra\',\'Delhi\',\'2020-01-09 02:10:00\',\'2020-01-09 09:10:10\'),(\'FLI00009\',\'Goa\',\'Delhi\',\'2020-01-10 01:10:10\',\'2020-01-10 09:10:10\'),(\'FLI00010\',\'Haridwar\',\'Delhi\',\'2020-01-01 03:10:00\',\'2020-01-01 09:10:10\'),(\'FLI00011\',\'Delhi\',\'Sirohi\',\'2020-01-10 05:10:10\',\'2020-01-10 09:10:10\'),(\'FLI00012\',\'Aurangabad\',\'Mumbai\',\'2020-01-01 07:10:00\',\'2020-01-01 09:10:10\'),(\'FLI00014\',\'North Panjim\',\'Goa\',\'2020-01-09 09:10:10\',\'2020-01-09 10:30:10\');
    runQuery(callback,'INSERT INTO Restaurant VALUES(\'RES00000\',\'LOC00004\',\'Y\',\'north indian\'),(\'RES00001\',\'LOC00003\',\'Y\',\'south indian\'),(\'RES00002\',\'LOC00005\',\'Y\',\'chinese\'),(\'RES00003\',\'LOC00008\',\'Y\',\'mughlai\'),(\'RES00004\',\'LOC00011\',\'Y\',\'italian\'),(\'RES00005\',\'LOC00008\',\'Y\',\'continental\'),(\'RES00006\',\'LOC00012\',\'Y\',\'american\'),(\'RES00007\',\'LOC00015\',\'Y\',\'greek\'),(\'RES00008\',\'LOC00019\',\'N\',\'british\'),(\'RES00009\',\'LOC00020\',\'N\',\'french\'),(\'RES00010\',\'LOC00019\',\'Y\',\'south indian\'),(\'RES00011\',\'LOC00023\',\'Y\',\'north indian\'),(\'RES00012\',\'LOC00029\',\'N\',\'north indian\'),(\'RES00013\',\'LOC00038\',\'Y\',\'chinese\'),(\'RES00014\',\'LOC00039\',\'N\',\'mughlai\'),(\'RES00015\',\'LOC00040\',\'N\',\'south indian\'),(\'RES00016\',\'LOC00020\',\'Y\',\'north indian\'),(\'RES00017\',\'LOC00015\',\'N\',\'north indian\'),(\'RES00018\',\'LOC00020\',\'Y\',\'italian\'),(\'RES00019\',\'LOC00008\',\'Y\',\'continental\'),(\'RES00020\',\'LOC00019\',\'Y\',\'north indian\'),(\'RES00021\',\'LOC00038\',\'Y\',\'north indian\'),(\'RES00022\',\'LOC00003\',\'Y\',\'american\'),(\'RES00023\',\'LOC00012\',\'Y\',\'greek\'),(\'RES00024\',\'LOC00004\',\'Y\',\'north indian\'),(\'RES00025\',\'LOC00005\',\'Y\',\'french\'),(\'RES00026\',\'LOC00003\',\'Y\',\'chinese\'),(\'RES00027\',\'LOC00020\',\'Y\',\'mughlai\'),(\'RES00028\',\'LOC00040\',\'Y\',\'italian\');
    runQuery(callback,'INSERT INTO Food_Item VALUES(\'FOO00000\',\'Dal Makhni\',\'north indian\'),(\'FOO00001\',\'Dosa\',\'south indian\'),(\'FOO00002\',\'Hakka Noodles\',\'chinese\'),(\'FOO00003\',\'Butter Chicken\',\'mughlai\'),(\'FOO00004\',\'Cheese Pizza\',\'italian\'),(\'FOO00005\',\'Bagels\',\'continental\'),(\'FOO00006\',\'French Toast\',\'american\'),(\'FOO00007\',\'Amygdalota\',\'greek\'),(\'FOO00008\',\'Bread\',\'british\'),(\'FOO00009\',\'French Toast\',\'french\'),(\'FOO00010\',\'Masala Dosa\',\'south indian\'),(\'FOO00011\',\'Malai Kofta\',\'north indian\'),(\'FOO00012\',\'Malai Kofta\',\'north indian\'),(\'FOO00013\',\'Tomato Soup\',\'chinese\'),(\'FOO00014\',\'Tandoori Chicken\',\'mughlai\'),(\'FOO00015\',\'Idli\',\'south indian\'),(\'FOO00016\',\'Aloo Gobhi\',\'north indian\'),(\'FOO00017\',\'Aloo Matar\',\'north indian\'),(\'FOO00018\',\'Margherita\',\'italian\'),(\'FOO00019\',\'Aloo Tikki Burger\',\'continental\'),(\'FOO00020\',\'Bhindi\',\'north indian\'),(\'FOO00021\',\'Ghiya\',\'north indian\'),(\'FOO00022\',\'Waffle\',\'american\'),(\'FOO00023\',\'Baklava\',\'greek\'),(\'FOO00024\',\'Malai Kofta\',\'north indian\'),(\'FOO00025\',\'Croissant\',\'french\'),(\'FOO00026\',\'Momos\',\'chinese\'),(\'FOO00027\',\'Butter chicken\',\'mughlai\'),(\'FOO00028\',\'Farmhouse Pizza\',\'italian\'),(\'FOO00029\',\'Awadhi Biryani\',\'north indian\'),(\'FOO00030\',\'chole Bhature\',\'north indian\'),(\'FOO00031\',\'Naan/rumali roti\',\'north indian\'),(\'FOO00032\',\'chicken butter Masala\',\'north indian\'),(\'FOO00033\',\'Murg Makhni\',\'north indian\'),(\'FOO00034\',\'Liti chokha\',\'north indian\'),(\'FOO00035\',\'Baigan Bhartha\',\'north indian\'),(\'FOO00036\',\'Kashmiri dam allo\',\'north indian\'),(\'FOO00037\',\'tikka masala\',\'north indian\'),(\'FOO00038\',\'tandhori chicken\',\'north indian\'),(\'FOO00039\',\'parathe\',\'north indian\'),(\'FOO00040\',\'Rajma chawal\',\'north indian\'),(\'FOO00041\',\'papad ki sabji\',\'north indian\'),(\'FOO00042\',\'sarso ka saag or makki ki roti\',\'north indian\'), (\'FOO00043\',\'Rogan Josh/Laal Maans\',\'north indian\'),(\'FOO00044\',\'dahi vadha\',\'north indian\'),(\'FOO00045\',\'kadhi\',\'north indian\'),(\'FOO00046\',\'rabhri\',\'north indian\'),(\'FOO00047\',\'Aam ka murabha\',\'north indian\'),(\'FOO00048\',\'ghewar\',\'north indian\'),(\'FOO00049\',\'lassi\',\'north indian\'),(\'FOO00050\',\'masala vadha\',\'south indian\'),(\'FOO00051\',\'keerai vadhai\',\'south indian\'),(\'FOO00052\',\'APPAM WITH TANGA PAL/KURMA\',\'south indian\'),(\'FOO00053\',\'PUTTU\',\'south indian\'),(\'FOO00054\',\'PESARATTU\',\'south indian\'),(\'FOO00055\',\'RASAM RICE\',\'south indian\'),(\'FOO00056\',\'BISIBELEBHATH\',\'south indian\'),(\'FOO00057\',\'PULIYOGARE\',\'south indian\'),(\'FOO00058\',\'PAZHAM PORI\',\'south indian\'),(\'FOO00059\',\' VATHA KUZHAMBU\',\'south indian\'),(\'FOO00060\',\'PESARAPAPPU PAYASAM\',\'south indian\'),(\'FOO00061\',\'UTTAPPAM\',\'south indian\'),(\'FOO00062\',\' RAVA IDLY\',\'south indian\'),(\'FOO00063\',\'ONION RAVA DOSA\',\'south indian\'),(\'FOO00064\',\'ADIRASAM\',\'south indian\'),(\'FOO00065\',\'VANGI BATH\',\'south indian\'),(\'FOO00066\',\'BIRIYANI\',\'south indian\'),(\'FOO00067\',\'GONGKURA\',\'south indian\'),(\'FOO00068\',\'MYSORE BONDA\',\'south indian\'),(\'FOO00069\',\'stuffed Eggplant with schezwan Sauce\',\'chinese\'),(\'FOO00070\',\'almond and chicken momos\',\'chinese\'),(\'FOO00071\',\'peri peri chicken satay\',\'chinese\'),(\'FOO00072\',\'veg fried rice\',\'chinese\'),(\'FOO00073\',\' honey chilli potato\',\'chinese\'),(\'FOO00074\',\'garlic soya chicken \',\'chinese\'),(\'FOO00075\',\'Mapo tofu with Spring ONion and black beans\',\'chinese\'),(\'FOO00076\',\'Stir fried mushroom\',\'chinese\'),(\'FOO00077\',\'vegetable manchow soup\',\'chinese\'),(\'FOO00078\',\'quick Noodles\',\'chinese\'),(\'FOO00079\',\'chilli fish\',\'chinese\'),(\'FOO00080\',\'Cantonese chiken Soup\',\'chinese\'),(\'FOO00081\',\'Stir fried Tofu with rice\',\'chinese\'),(\'FOO00082\',\'garlic and egg fried RICE\',\'chinese\'),(\'FOO00083\',\'hot and Sour Soup\',\'chinese\'),(\'FOO00084\',\'Asian BBQ chicken\',\'chinese\'),(\'FOO00085\',\'chilli soya Nugets\',\'chinese\'),(\'FOO00086\',\'gDate pancakes\',\'chinese\'),(\'FOO00087\',\'Mushroom Fried rice\',\'chinese\'),(\'FOO00088\',\'chilli Gobhi\',\'chinese\'),(\'FOO00089\',\'okra with baby corn\',\'chinese\'),(\'FOO00090\',\'vegetable chowmein\',\'chinese\'),(\'FOO00091\',\'mughlai parathe\',\'mughlai\'),(\'FOO00092\',\'haleem\',\'mughlai\'),(\'FOO00093\',\'kachri keema\',\'mughlai\'),(\'FOO00094\',\'keema Matar\',\'mughlai\'),(\'FOO00095\',\'Murg Mussalaam\',\'mughlai\'),(\'FOO00096\',\'Murg kali Mirch\',\'mughlai\'),(\'FOO00097\',\'margisi kofta\',\'mughlai\'),(\'FOO00098\',\'reshmi kebab\',\'mughlai\'),(\'FOO00099\',\'murg pasanda\',\'mughlai\'),(\'FOO00100\',\'Muton Rezala\',\'mughlai\'),(\'FOO00101\',\'Mutton rogan josh\',\'mughlai\'),(\'FOO00102\',\'Boti kebab\',\'mughlai\'),(\'FOO00103\',\'kofta Shorba\',\'mughlai\'),(\'FOO00104\',\'Shahi tukra\',\'mughlai\'),(\'FOO00105\',\'anjeer halwa\',\'mughlai\'),(\'FOO00106\',\'sheer khurma\',\'mughlai\'),(\'FOO00107\',\'Shahi kaju aloo\',\'mughlai\'),(\'FOO00108\',\'Murg Noorjehani\',\'mughlai\'),(\'FOO00109\',\'garlic Pizza\',\'italian\'),(\'FOO00110\',\'Bottarga\',\'italian\'),(\'FOO00111\',\'lasagna\',\'italian\'),(\'FOO00112\',\'fiorenrina Steak\',\'italian\'),(\'FOO00113\',\'Ribollita\',\'italian\'),(\'FOO00114\',\'Polenta\',\'italian\'),(\'FOO00115\',\'Ossobuco\',\'italian\'),(\'FOO00116\',\'Risotto\',\'italian\'),(\'FOO00117\',\'Carbonara\',\'italian\'),(\'FOO00118\',\'Truffles\',\'italian\'),(\'FOO00119\',\'Focaccia\',\'italian\'),(\'FOO00120\',\'Araancini\',\'italian\'),(\'FOO00121\',\'Suppli\',\'italian\'),(\'FOO00122\',\'Coffee\',\'italian\'),(\'FOO00123\',\'gelato\',\'italian\'),(\'FOO00124\',\'Tiramisu\',\'italian\'),(\'FOO00125\',\'Digestivo\',\'italian\'),(\'FOO00126\',\'crispy calamari Rings\',\'continental\'),(\'FOO00127\',\'Quick salteed Caramel Pie\',\'continental\'),(\'FOO00128\',\'Sweet Potato Pie\',\'continental\'),(\'FOO00129\',\'Prawn Pie\',\'continental\'),(\'FOO00130\',\'Sticky Toffee Pudding\',\'continental\'),(\'FOO00131\',\'yorkshire Lamb Patties\',\'continental\'),(\'FOO00132\',\'Poached Pear Salad\',\'continental\'),(\'FOO00133\',\'Chicken and cheese salad\',\'continental\'),(\'FOO00134\',\'Sausage and potato casserole\',\'continental\'),(\'FOO00135\',\'Roast lamb salad\',\'continental\'),(\'FOO00136\',\'Stuffed jacket Potatoes\',\'continental\'),(\'FOO00137\',\'The trio of Tomatoes\',\'continental\'),(\'FOO00138\',\'paneer steak\',\'continental\'),(\'FOO00139\',\'Butter fried fish with cheese Sauce\',\'continental\'),(\'FOO00140\',\'BLT eggy bread\',\'continental\'),(\'FOO00141\',\'Batter Fish\',\'continental\'),(\'FOO00142\',\'Baked Vegetables\',\'continental\'),(\'FOO00143\',\'Baked Mushrooms and capsicum\',\'continental\'),(\'FOO00144\',\'East west spring roll\',\'continental\'),(\'FOO00145\',\'Panko crusted cottage cheese\',\'continental\'),(\'FOO00146\',\'chickpea Soup\',\'continental\'),(\'FOO00147\',\'glazed ham\',\'continental\'),(\'FOO00148\',\'Roast turkey with cranberry Sauce\',\'continental\'),(\'FOO00149\',\'Honey roast chicken\',\'continental\'),(\'FOO00150\',\'Bacon Wrapped Dates \',\'american\'),(\'FOO00151\',\'leafy salad with walnuts\',\'american\'),(\'FOO00152\',\'chicken Piccata with Bread salad\',\'american\'),(\'FOO00153\',\'smoked kidney bean salad\',\'american\'),(\'FOO00154\',\'sausage pepper burger\',\'american\'),(\'FOO00155\',\'pineapple cheese and ham salad\',\'american\'),(\'FOO00156\',\'fish mayonnaise\',\'american\'),(\'FOO00157\',\'apple sauce\',\'american\'),(\'FOO00158\',\'date and walnut pie\',\'american\'),(\'FOO00159\',\'Roast leg of ham\',\'american\'),(\'FOO00160\',\'grilled citrus fish\',\'american\'),(\'FOO00161\',\'scotch eggs\',\'american\'),(\'FOO00162\',\'Bacon and herb scones\',\'american\'),(\'FOO00163\',\'hot cross Buns\',\'american\'),(\'FOO00164\',\'grilled lobster eith wine sauce\',\'american\'),(\'FOO00165\',\'chiken pie\',\'american\'),(\'FOO00166\',\'Microwave chicken Steak\',\'american\'),(\'FOO00167\',\'filled cucumber cases\',\'american\'),(\'FOO00168\',\'grilled chicken with shallot sauce\',\'american\'),(\'FOO00169\',\'chicken salad\',\'american\'),(\'FOO00170\',\'Mutton stew\',\'american\'),(\'FOO00171\',\'grilled vegetable capachio\',\'american\'),(\'FOO00172\',\'Mushroom and herb filled tomatoes\',\'american\'),(\'FOO00173\',\'cheese steaks\',\'american\'),(\'FOO00174\',\'lamb steaks\',\'american\'),(\'FOO00175\',\'chicken steak\',\'american\'),(\'FOO00176\',\'bougatsa\',\'greek\'),(\'FOO00177\',\'courgette balls\',\'greek\'),(\'FOO00178\',\'dolmadakia\',\'greek\'),(\'FOO00179\',\'tomatokeftedes\',\'greek\'),(\'FOO00180\',\'ellinikos\',\'greek\'),(\'FOO00181\',\'greek fava dip\',\'greek\'),(\'FOO00182\',\'feta me meli\',\'greek\'),(\'FOO00183\',\'frappe\',\'greek\'),(\'FOO00184\',\'galaktoboureko\',\'greek\'),(\'FOO00185\',\'greek Salad\',\'greek\'),(\'FOO00186\',\'gyros\',\'greek\'),(\'FOO00187\',\'halvas\',\'greek\'),(\'FOO00188\',\'kataifi\',\'greek\'),(\'FOO00189\',\'fish and chips\',\'british\'),(\'FOO00190\',\'the great english Sunday Roast\',\'british\'),(\'FOO00191\',\'Bangers and mash\',\'british\'),(\'FOO00192\',\'yorkshire tea\',\'british\'),(\'FOO00193\',\'toad in the hole\',\'british\'),(\'FOO00194\',\'steak and kideny pie\',\'british\'),(\'FOO00195\',\'spotted dish\',\'british\'),(\'FOO00196\',\'shepherds Pie\',\'british\'),(\'FOO00197\',\'cottage Pie\',\'british\'),(\'FOO00198\',\'bubble and squeaks\',\'british\'),(\'FOO00199\',\'baguette\',\'french\'),(\'FOO00200\',\'beignet\',\'french\'),(\'FOO00201\',\'blanquette\',\'french\'),(\'FOO00202\',\'Bouef Bourguignon\',\'french\'),(\'FOO00203\',\'Bouillabasse\',\'french\'),(\'FOO00204\',\'Brioche\',\'french\'),(\'FOO00205\',\'cassoulet\',\'french\'),(\'FOO00206\',\'champagne\',\'french\'),(\'FOO00207\',\'charcuterie\',\'french\'),(\'FOO00208\',\'chausson aux pommes\',\'french\');
    runQuery(callback,'INSERT INTO Taxi VALUES(\'TAX00000\',\'ciaz\',4,\'Y\'),(\'TAX00001\',\'ritz\',4,\'N\'),(\'TAX00002\',\'bmw\',4,\'Y\'),(\'TAX00003\',\'swift\',4,\'Y\'),(\'TAX00004\',\'ciaz\',4,\'Y\'),(\'TAX00005\',\'scorpio\',7,\'Y\'),(\'TAX00006\',\'ertiga\',7,\'Y\'),(\'TAX00007\',\'maruti Eeco\',6,\'N\'),(\'TAX00008\',\'i10\',4,\'Y\'),(\'TAX00009\',\'xuv\',4,\'Y\');')
    runQuery(callback,'INSERT INTO route VALUES(\'BUS00000\',\'LOC00031\',\'04:00:00\'),(\'BUS00000\',\'LOC00049\',\'12:00:00\'),(\'BUS00000\',\'LOC00041\',\'20:00:00\'),(\'BUS00000\',\'LOC00018\',\'01:30:00\'),(\'BUS00000\',\'LOC00008\',\'10:30:00\'),(\'BUS00001\',\'LOC00032\',\'01:00:00\'),(\'BUS00001\',\'LOC00018\',\'05:00:00\'),(\'BUS00001\',\'LOC00050\',\'09:00:00\'),(\'BUS00001\',\'LOC00007\',\'14:30:00\'),(\'BUS00001\',\'LOC00035\',\'06:00:00\'),(\'BUS00002\',\'LOC00019\',\'12:00:00\'),(\'BUS00002\',\'LOC00018\',\'16:00:00\'),(\'BUS00002\',\'LOC00005\',\'20:00:00\'),(\'BUS00003\',\'LOC00015\',\'08:00:00\'),(\'BUS00003\',\'LOC00027\',\'12:00:00\'),(\'BUS00003\',\'LOC00030\',\'16:00:00\'),(\'BUS00004\',\'LOC00015\',\'01:00:00\'),(\'BUS00004\',\'LOC00017\',\'02:00:00\'),(\'BUS00004\',\'LOC00018\',\'03:00:00\'),(\'BUS00004\',\'LOC00026\',\'08:00:00\'),(\'BUS00005\',\'LOC00019\',\'21:00:00\'),(\'BUS00005\',\'LOC00044\',\'24:00:00\'),(\'BUS00005\',\'LOC00030\',\'06:00:00\'),(\'BUS00006\',\'LOC00029\',\'05:00:00\'),(\'BUS00006\',\'LOC00044\',\'10:00:00\'),(\'BUS00006\',\'LOC00046\',\'15:00:00\'),(\'BUS00006\',\'LOC00033\',\'23:00:00\'),(\'BUS00007\',\'LOC00001\',\'09:00:00\'),(\'BUS00007\',\'LOC00002\',\'10:00:00\'),(\'BUS00007\',\'LOC00004\',\'14:00:00\'),(\'BUS00007\',\'LOC00008\',\'16:00:00\'),(\'BUS00008\',\'LOC00018\',\'07:00:00\'),(\'BUS00008\',\'LOC00020\',\'11:00:00\'),(\'BUS00008\',\'LOC00023\',\'14:00:00\'),(\'BUS00009\',\'LOC00015\',\'01:00:00\'),(\'BUS00009\',\'LOC00050\',\'04:00:00\'),(\'BUS00009\',\'LOC00008\',\'10:00:00\'),(\'BUS00009\',\'LOC00001\',\'14:00:00\'),(\'BUS00010\',\'LOC00016\',\'04:00:00\'),(\'BUS00010\',\'LOC00050\',\'08:00:00\'),(\'BUS00010\',\'LOC00008\',\'12:00:00\'),(\'BUS00011\',\'LOC00017\',\'05:00:00\'),(\'BUS00011\',\'LOC00011\',\'10:00:00\'),(\'BUS00012\',\'LOC00018\',\'02:00:00\'),(\'BUS00012\',\'LOC00050\',\'04:00:00\'),(\'BUS00012\',\'LOC00008\',\'10:00:00\'),(\'BUS00012\',\'LOC00001\',\'14:00:00\'),(\'BUS00013\',\'LOC00018\',\'06:00:00\'),(\'BUS00013\',\'LOC00050\',\'10:00:00\'),(\'BUS00013\',\'LOC00008\',\'14:00:00\'),(\'BUS00014\',\'LOC00018\',\'01:00:00\'),(\'BUS00014\',\'LOC00050\',\'04:00:00\'),(\'BUS00014\',\'LOC00008\',\'10:00:00\'),(\'BUS00014\',\'LOC00001\',\'15:00:00\'),(\'BUS00015\',\'LOC00033\',\'04:00:00\'),(\'BUS00015\',\'LOC00018\',\'08:00:00\'),(\'BUS00015\',\'LOC00050\',\'12:00:00\'),(\'BUS00015\',\'LOC00008\',\'18:00:00\'),(\'BUS00015\',\'LOC00001\',\'23:00:00\'),(\'BUS00016\',\'LOC00029\',\'02:00:00\'),(\'BUS00016\',\'LOC00018\',\'01:00:00\'),(\'BUS00016\',\'LOC00050\',\'04:00:00\'),(\'BUS00016\',\'LOC00008\',\'10:00:00\'),(\'BUS00017\',\'LOC00008\',\'03:00:00\'),(\'BUS00017\',\'LOC00050\',\'09:00:00\'),(\'BUS00017\',\'LOC00018\',\'13:00:00\'),(\'BUS00017\',\'LOC00036\',\'16:00:00\'),(\'BUS00018\',\'LOC00015\',\'09:00:00\'),(\'BUS00018\',\'LOC00018\',\'10:00:00\'),(\'BUS00018\',\'LOC00050\',\'14:00:00\'),(\'BUS00018\',\'LOC00008\',\'24:00:00\'),(\'BUS00018\',\'LOC00005\',\'02:00:00\'),(\'BUS00019\',\'LOC00003\',\'07:00:00\'),(\'BUS00019\',\'LOC00018\',\'10:00:00\'),(\'BUS00019\',\'LOC00050\',\'14:00:00\'),(\'BUS00019\',\'LOC00008\',\'24:00:00\'),(\'BUS00019\',\'LOC00037\',\'10:00:00\'),(\'BUS00020\',\'LOC00009\',\'02:00:00\'),(\'BUS00020\',\'LOC00037\',\'08:00:00\'),(\'BUS00020\',\'LOC00038\',\'12:00:00\'),(\'TRA00000\',\'LOC00005\',\'01:00:00\'),(\'TRA00000\',\'LOC00008\',\'16:00:00\'),(\'TRA00000\',\'LOC00031\',\'18:00:00\'),(\'TRA00000\',\'LOC00036\',\'01:00:00\'),(\'TRA00001\',\'LOC00009\',\'12:00:00\'),(\'TRA00001\',\'LOC00050\',\'24:00:00\'),(\'TRA00001\',\'LOC00005\',\'23:00:00\'),(\'TRA00001\',\'LOC00019\',\'12:00:00\'),(\'TRA00001\',\'LOC00032\',\'01:00:00\'),(\'TRA00002\',\'LOC00004\',\'12:00:00\'),(\'TRA00002\',\'LOC00001\',\'14:00:00\'),(\'TRA00002\',\'LOC00050\',\'16:00:00\'),(\'TRA00002\',\'LOC00008\',\'18:00:00\'),(\'TRA00003\',\'LOC00011\',\'20:00:00\'),(\'TRA00003\',\'LOC00051\',\'24:00:00\'),(\'TRA00003\',\'LOC00001\',\'23:00:00\'),(\'TRA00004\',\'LOC00021\',\'01:00:00\'),(\'TRA00004\',\'LOC00008\',\'09:00:00\'),(\'TRA00004\',\'LOC00050\',\'13:00:00\'),(\'TRA00004\',\'LOC00051\',\'18:00:00\'),(\'TRA00004\',\'LOC00001\',\'23:00:00\'),(\'TRA00005\',\'LOC00022\',\'01:00:00\'),(\'TRA00005\',\'LOC00048\',\'05:00:00\'),(\'TRA00005\',\'LOC00033\',\'08:00:00\'),(\'TRA00006\',\'LOC00025\',\'09:00:00\'),(\'TRA00006\',\'LOC00015\',\'16:00:00\'),(\'TRA00006\',\'LOC00050\',\'21:00:00\'),(\'TRA00006\',\'LOC00051\',\'12:00:00\'),(\'TRA00006\',\'LOC00002\',\'18:00:00\'),(\'TRA00007\',\'LOC00035\',\'16:00:00\'),(\'TRA00007\',\'LOC00021\',\'21:00:00\'),(\'TRA00007\',\'LOC00015\',\'24:00:00\'),(\'TRA00008\',\'LOC00036\',\'02:00:00\'),(\'TRA00008\',\'LOC00019\',\'12:00:00\'),(\'TRA00008\',\'LOC00018\',\'13:00:00\'),(\'TRA00008\',\'LOC00015\',\'19:00:00\'),(\'TRA00009\',\'LOC00037\',\'23:00:00\'),(\'TRA00009\',\'LOC00036\',\'12:00:00\'),(\'TRA00009\',\'LOC00019\',\'21:00:00\'),(\'TRA00009\',\'LOC00018\',\'05:00:00\'),(\'TRA00009\',\'LOC00015\',\'08:00:00\'),(\'TRA00010\',\'LOC00001\',\'12:00:00\'),(\'TRA00010\',\'LOC00051\',\'01:00:00\'),(\'TRA00010\',\'LOC00050\',\'12:00:00\'),(\'TRA00010\',\'LOC00015\',\'16:00:00\'),(\'TRA00010\',\'LOC00021\',\'18:00:00\'),(\'TRA00010\',\'LOC00033\',\'20:00:00\'),(\'TRA00011\',\'LOC00001\',\'22:00:00\'),(\'TRA00011\',\'LOC00017\',\'08:00:00\'),(\'TRA00011\',\'LOC00021\',\'05:00:00\'),(\'TRA00011\',\'LOC00025\',\'12:00:00\'),(\'TRA00012\',\'LOC00001\',\'04:00:00\'),(\'TRA00012\',\'LOC00051\',\'06:00:00\'),(\'TRA00012\',\'LOC00050\',\'10:00:00\'),(\'TRA00012\',\'LOC00015\',\'15:00:00\'),(\'TRA00012\',\'LOC00021\',\'18:00:00\'),(\'TRA00012\',\'LOC00025\',\'19:00:00\'),(\'TRA00013\',\'LOC00002\',\'04:00:00\'),(\'TRA00013\',\'LOC00011\',\'12:00:00\'),(\'TRA00013\',\'LOC00021\',\'21:00:00\'),(\'TRA00013\',\'LOC00022\',\'03:00:00\'),(\'TRA00013\',\'LOC00034\',\'12:00:00\'),(\'TRA00014\',\'LOC00025\',\'24:00:00\'),(\'TRA00014\',\'LOC00050\',\'01:00:00\'),(\'TRA00014\',\'LOC00051\',\'11:00:00\'),(\'TRA00014\',\'LOC00001\',\'13:00:00\'),(\'TRA00014\',\'LOC00004\',\'20:00:00\'),(\'TRA00015\',\'LOC00015\',\'02:00:00\'),(\'TRA00015\',\'LOC00022\',\'12:00:00\'),(\'TRA00015\',\'LOC00021\',\'20:00:00\'),(\'TRA00015\',\'LOC00023\',\'04:00:00\');
    runQuery(callback,'INSERT INTO guide VALUES(\'GUI00000\',\'jam\',\'TOR00001\'),(\'GUI00001\',\'rocky\',\'TOR00002\'),(\'GUI00002\',\'heggy\',\'TOR00003\'),(\'GUI00003\',\'kal\',\'TOR00004\'),(\'GUI00004\',\'kailash\',\'TOR00005\'),(\'GUI00005\',\'brack\',\'TOR00006\'),(\'GUI00006\',\'work\',\'TOR00007\'),(\'GUI00007\',\'kat\',\'TOR00008\'),(\'GUI00008\',\'henry\',\'TOR00009\'),(\'GUI00009\',\'goldy\',\'TOR00010\'),(\'GUI00010\',\'boldy\',\'TOR00011\'),(\'GUI00011\',\'koli\',\'TOR00012\'),(\'GUI00012\',\'oxford\',\'TOR00013\'),(\'GUI00013\',\'shabi\',\'TOR00014\'),(\'GUI00014\',\'happy\',\'TOR00015\'),(\'GUI00015\',\'tom\',\'TOR00016\'),(\'GUI00016\',\'rom\',\'TOR00017\'),(\'GUI00017\',\'black\',\'TOR00018\'),(\'GUI00018\',\'jack\',\'TOR00019\'),(\'GUI00019\',\'rahul\',\'TOR00020\'),(\'GUI00020\',\'raj\',\'TOR00021\'),(\'GUI00021\',\'oxford\',\'TOR00022\');')
    runQuery(callback,'INSERT INTO trip VALUES(\'TRP00000\',\'2019-1-3\',\'2019-1-13\',\'ladakh\'),(\'TRP00001\',\'2020-2-14\',\'2020-2-27\',\'ladakh\'),(\'TRP00002\',\'2019-3-31\',\'2019-4-13\',\'ladakh\'),(\'TRP00003\',\'2019-4-20\',\'2019-4-30\',\'J&K\'),(\'TRP00004\',\'2019-5-3\',\'2019-5-13\',\'J&K\'),(\'TRP00005\',\'2019-5-20\',\'2019-5-28\',\'Srinagar\'),(\'TRP00006\',\'2019-6-1\',\'2019-6-13\',\'Srinagar\'),(\'TRP00007\',\'2019-6-3\',\'2019-7-20\',\'Srinagar\'),(\'TRP00008\',\'2019-7-19\',\'2019-7-29\',\'Shimla\'),(\'TRP00009\',\'2019-7-30\',\'2019-8-30\',\'Dehradun\'),(\'TRP00010\',\'2019-9-12\',\'2019-9-22\',\'Chamoli\'),(\'TRP00011\',\'2019-11-23\',\'2019-12-1\',\'Haridwar\');')
    runQuery(callback,'INSERT INTO service_request VALUES(\'RST00000\',\'TRP00000\',\'BUS00011\',\'2020-01-01 10:10:10\',8,8000,\"Pending\",null,null,null),(\'RST00001\',\'TRP00001\',\'FOO00004\',\'2020-01-01 10:10:10\',4,4000,\"Accepted\",null,null,null),(\'RST00002\',\'TRP00002\',\'FLI00005\',\'2020-01-01 10:10:10\',5,5000,\"Completed\",null,null,null),(\'RST00003\',\'TRP00003\',\'TAX00005\',\'2020-01-01 10:10:10\',4,4000,\"paid\",null,null,null),(\'RST00004\',\'TRP00004\',\'ROO00005\',\'2020-01-01 10:10:10\',5,5000,\"Pending\",null,null,null),(\'RST00005\',\'TRP00005\',\'TRA00015\',\'2020-01-01 10:10:10\',4,3000,\"Accepted\",null,null,null),(\'RST00006\',\'TRP00006\',\'BUS00007\',\'2020-01-01 10:10:10\',4,2500,\"Completed\",null,null,null),(\'RST00007\',\'TRP00007\',\'TAX00009\',\'2020-01-01 10:10:10\',4,5000,\"Rejected\",null,null,null),(\'RST00008\',\'TRP00008\',\'FOO00013\',\'2020-01-01 10:10:10\',1,2000,\"Pending\",null,null,null),(\'RST00009\',\'TRP00009\',\'ROO00002\',\'2020-01-01 10:10:10\',2,2500,\"Accepted\",null,null,null),(\'RST00010\',\'TRP00010\',\'ROO00009\',\'2020-01-01 10:10:10\',7,8000,\"Completed\",null,null,null),(\'RST00011\',\'TRP00011\',\'TAX00006\',\'2020-01-01 10:10:10\',4,4000,\"Rejected\",null,null,null);')
    runQuery(callback,'INSERT INTO query VALUES(\'QRY00000\',\'USR00000\',\'is there any smoking room In hotel ?\'),(\'QRY00001\',\'USR00001\',\'Can you make sea food on special demand ?\'),(\'QRY00002\',\'USR00002\',\'What is the last time we can report before the flight ?\'),(\'QRY00003\',\'USR00003\',\'Can I change my destination 2 times ?\'),(\'QRY00004\',\'USR00004\',\'Can I book more than 2 seats on one identity card? \'),(\'QRY00005\',\'USR00005\',\'Can I travel with my pet dog ?\'),(\'QRY00006\',\'USR00006\',\'Is there any female guide ?\'),(\'QRY00007\',\'USR00007\',\'Will there be 2 bathroom ?\'),(\'QRY00008\',\'USR00008\',\'Whether they use garlic or not ?\'),(\'QRY00009\',\'USR00009\',\'is there swimming pool in your hotel ?\'),(\'QRY00010\',\'USR00010\',\'do you accept online payment ?\'),(\'QRY00011\',\'USR00011\',\'Can you make food on special demands ?\');')
    runQuery(callback,'INSERT INTO Train VALUES(\'TRA00000\',\'LOC00005\',\'LOC00036\',\'YNYYNYY\',\'Y\'),(\'TRA00001\',\'LOC00009\',\'LOC00032\',\'YYNNYYY\',\'Y\'),(\'TRA00002\',\'LOC00004\',\'LOC00015\',\'YNYYNYY\',\'Y\'),(\'TRA00003\',\'LOC00011\',\'LOC00001\',\'YNYNYNY\',\'N\'),(\'TRA00004\',\'LOC00021\',\'LOC00002\',\'YNYNYNY\',\'Y\'),(\'TRA00005\',\'LOC00022\',\'LOC00033\',\'YNYNYNY\',\'Y\'),(\'TRA00006\',\'LOC00025\',\'LOC00002\',\'YNYNYNY\',\'N\'),(\'TRA00007\',\'LOC00035\',\'LOC00001\',\'YNYNYNY\',\'N\'), (\'TRA00008\',\'LOC00036\',\'LOC00015\',\'YNYNYNY\',\'N\'),(\'TRA00009\',\'LOC00037\',\'LOC00016\',\'YNYNYNY\',\'Y\'),(\'TRA00010\',\'LOC00001\',\'LOC00033\',\'YNYNYNY\',\'N\'),(\'TRA00011\',\'LOC00011\',\'LOC00020\',\'YNYNYNY\',\'N\'),(\'TRA00012\',\'LOC00001\',\'LOC00025\',\'YNYNYNY\',\'N\'),(\'TRA00013\',\'LOC00002\',\'LOC00034\',\'YNYNYNY\',\'N\'),(\'TRA00014\',\'LOC00025\',\'LOC00004\',\'YNYNYNY\',\'Y\'),(\'TRA00015\',\'LOC00015\',\'LOC00023\',\'YNYNYNY\',\'Y\');')
    runQuery(callback,'INSERT INTO Bus VALUES(\'BUS00000\',\'LOC00031\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00001\',\'LOC00032\',\'LOC00007\',\'YYYNYNY\',\'Y\'),(\'BUS00002\',\'LOC00035\',\'LOC00005\',\'YNNNYNY\',\'Y\'),(\'BUS00003\',\'LOC00015\',\'LOC00030\',\'YNYYYNY\',\'Y\'),(\'BUS00004\',\'LOC00015\',\'LOC00026\',\'YNYNNNY\',\'Y\'),(\'BUS00005\',\'LOC00019\',\'LOC00030\',\'YNYNNYY\',\'Y\'),(\'BUS00006\',\'LOC00029\',\'LOC00033\',\'YNYNYNY\',\'Y\'),(\'BUS00007\',\'LOC00001\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00008\',\'LOC00018\',\'LOC00023\',\'YNYNYNY\',\'N\'),(\'BUS00009\',\'LOC00015\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00010\',\'LOC00016\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00011\',\'LOC00017\',\'LOC00011\',\'YNYNYNY\',\'Y\'),(\'BUS00012\',\'LOC00018\',\'LOC00003\',\'YNYNYNY\',\'N\'),(\'BUS00013\',\'LOC00015\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00014\',\'LOC00018\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00015\',\'LOC00033\',\'LOC00001\',\'YNYNYNY\',\'Y\'),(\'BUS00016\',\'LOC00029\',\'LOC00008\',\'YNYNYNY\',\'Y\'),(\'BUS00017\',\'LOC00008\',\'LOC00036\',\'YNYNYNY\',\'N\'),(\'BUS00018\',\'LOC00015\',\'LOC00005\',\'YNYNYNY\',\'Y\'),(\'BUS00019\',\'LOC00003\',\'LOC00037\',\'YNYNYNY\',\'N\'),(\'BUS00020\',\'LOC00009\',\'LOC00038\',\'YNYNYNY\',\'Y\');')

}

var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "lHyGk3wWaK",
  password: "IAahckiJYJ",
  database: "lHyGk3wWaK",
  multipleStatements: true
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
        } else {
            console.log(result);
            // console.log(callback);
            if(callback!=null)
            callback(result);
        }

    });
}
function runTransaction(callback,queries)
{
    console.log("Transaction Run/ :");
    console.log(queries);
    // con.query(queries,)
}
function insertIntoTable(callback,table_name, data) {
    query = 'insert into '+table_name+' values ('
    for(i = 0; i <tables[table_name].length;i++) {
        query += data[tables[table_name][i]];
        if(i != tables[table_name].length - 1)
            query += ', '
    }
    query += ');';
    // console.log('insert query:',query);
    runQuery(callback, query);
}

function selectAllFromTable(callback, table_name) {
    query = 'select distinct * from ' + table_name + ';';
    runQuery(callback, query);
}

// Register
function register_user(callback,user) {
    insertIntoTable(callback,'user', user);
}
function delete_service(callback,service_type,Service)
{
    
}
function register_service(callback,service_type,service)
{
    insertIntoTable(function(result){
        if(result)
        {
            console.log('inserted main');
            console.log(service_type);
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
                case 'guide':
                    insertIntoTable(callback,'guide',service);
            }
        }
        else{
            callback(null);
        }
    },'service', service);
    
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
    query = 'select distinct password from user where user_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_service_provider(callback, user_id) {
    query = 'select distinct password from service_provider where service_provider_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_administrator(callback, user_id) {
    query = 'select distinct password from administrator where admin_id = \"' + user_id + '\";'
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

// Location
function getLocations(callback, attribute_values) {
    query= 'select distinct * from location ' + whereClause(attribute_values) + ';';
    console.log(query);
    runQuery(callback,query);
}
function addLocation(callback,location) {
    insertIntoTable(callback,'location', location);
}

// Helpers
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


// User functions to display services according to filters
async function getFlights(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['flight', 'service'])
    }
    query = 'select distinct flight.service_id, service_provider_id, from_city, to_city, departure_time, arrival_time, price, discount, (SELECT distinct COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from flight, service where ( service.service_id = flight.service_id) and (' + whereClause(attribute_values) + ');'
    return await runQuery(callback, query);
}
function getBusTrains(callback, t_type, from, to, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['bus', 'train'])
    }
    query_bus = 'select distinct * from bus, route as r1, route as r2, location l1, location l2, service where (service.service_id = bus.service_id) and (bus.service_id = r1.service_id) and (l1.location_id = r1.location_id) and (r2.service_id = bus.service_id) and (l2.location_id = r2.location_id) and (l1.locality like ' + from +') and (l2.locality like ' + to + ') and (' + whereClause(attribute_values) + ')';
    query_train = 'select distinct * from train, route as r1, route as r2, location l1, location l2, service where (service.service_id = train.service_id) and (train.service_id = r1.service_id) and (l1.location_id = r1.location_id) and (r2.service_id = train.service_id) and (l2.location_id = r2.location_id) and  (l1.locality like ' + from +') and (l2.locality like ' + to + ') and (' + whereClause(attribute_values) + ')';
    console.log(t_type);
    if(t_type == 'B') {
        query = query_bus + ';';
    } else if(t_type == 'T') {
        query = query_train + ';';
    } else {
        query = '(' + query_bus + ') union (' + query_train + ');'
        // query = 'select distinct * from bus;'
        // query = query_bus;
    }
    runQuery(callback, query);
}
function getRoutes(callback) {
    query = 'select distinct * from route, location where route.location_id = location.location_id;'
    runQuery(callback, query);
}
function getTaxis(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['taxi', 'service'])
    }
    query = 'select distinct taxi.service_id, service_provider_id, car_name, capacity, AC, price, discount, (SELECT distinct COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from taxi, service where ( service.service_id = taxi.service_id) and (' + whereClause(attribute_values) + ');'
    runQuery(callback, query);
}
function getRooms(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['room', 'hotel', 'service'])
    }
    query = 'select distinct room.service_id, hotel.service_provider_id, service_provider.name as name, locality, city, room_type, capacity, wifi_facility, price, discount, (SELECT distinct COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from room, hotel, location, service, service_provider where (hotel.service_provider_id = service_provider.service_provider_id) and (service.service_id = room.service_id) and (hotel.service_provider_id = service.service_provider_id) and (location.location_id = hotel.location_id) and (' + whereClause(attribute_values) + ');'
    runQuery(callback, query);
}
function getFoodItems(callback,filters)
{
    query=`
    select distinct s.service_id,f.name,f.cuisine,s.price,s.discount,p.name as res_name,l.locality,l.city,r.delivers,
    (SELECT distinct COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=s.service_id)  as rating 
    from food_item as f,service_provider as p,location as l, restaurant as r,service as s 
    where(
    f.service_id=s.service_id and 
    p.service_provider_id=s.service_provider_id and 
    r.service_provider_id=s.service_provider_id and 
    l.location_id=r.location_id and
    f.name like `+filters.name+` and p.name like `+filters.rest+` and r.delivers like `+filters.delivers +`
    and p.service_provider_id like `+filters.service_provider_id+`);
    `
    runQuery(callback,query);
}
function getTouristSpots(callback, attribute_values, city, unvisited = false) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['tourist_spot'])
    }
    if(unvisited) {
        query = 'select distinct * from tourist_spot, location where (tourist_spot_id not in (select distinct tourist_spot_id from visited where user_id in ( select distinct user_id from trip where trip_id = ' + trip_id +')) tourist_spot.location_id = location.location_id and location.city REGEXP '+ city + ') and (' + whereClause(attribute_values) + ');';
    } else {
        query = 'select distinct * from tourist_spot, location where (tourist_spot.location_id = location.location_id and location.city like ' + city + ' ) and (' + whereClause(attribute_values) + ');';
    }
    runQuery(callback, query);
}
function getGuides(callback, attribute_values, tourist_spot_name, tourist_spot_city) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['guide', 'tourist_spot'])
    }
    query = 'select distinct guide.name as guide_name, tourist_spot.name as tourist_spot_name, locality, city, state, pincode, guide.service_id, guide.tourist_spot_id, type, entry_fee, price, (SELECT distinct COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating from guide, service, tourist_spot, location where (guide.service_id = service.service_id) and (guide.tourist_spot_id = tourist_spot.tourist_spot_id) and (tourist_spot.location_id = location.location_id and location.city like ' + tourist_spot_city + ' ) and ( tourist_spot.name like ' + tourist_spot_name + ');';
    runQuery(callback, query);
}
function getTrips(callback, attribute_values) {
    runQuery(callback, 'select distinct * from trip where ' + whereClause(attribute_values) + ';');
}
function getServiceRequests(callback, user_id, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['service_request']);
    }
    query = `select distinct * from service_request where trip_id in (select distinct trip_id from trip where trip.user_id = \"` + user_id +`\") and (` + whereClause(attribute_values) + `);`;
    runQuery(callback, query);
}
function providerGetRequests(callback,user_id)
{
    query = `select service_request.*,u.name,u.email,u.address,u.phone_no
    from service_request,service_provider as p, service as s,user as u,trip as t
    where (t.user_id=u.user_id and t.trip_id=service_request.trip_id and
    service_request.service_id=s.service_id and s.service_provider_id=p.service_provider_id 
    and p.service_provider_id like"`+user_id+`");`;
    runQuery(callback, query);
}
function allServiceRequest(callback,filterData)
{
    query=`select r.*, u.name as uname, u.user_id as uid, p.name as pname
    from service_request as r, user as u, trip as t, service_provider as p, service as s
    where( r.trip_id=t.trip_id and t.user_id=u.user_id and 
        r.service_id = s.service_id and p.service_provider_id=s.service_provider_id
        and u.name REGEXP "`+filterData.user_id+`" 
        and p.name REGEXP "`+filterData.pname+`"
        and s.service_id REGEXP "`+filterData.service_id+`")`;
    runQuery(callback,query);
}
function createTrip(callback, attribute_values) {
    query = 'insert into trip values ((select count(*) from trip), ' + attribute_values['user_id'] + ', ' + attribute_values['departure_date'] + ', ' + attribute_values['return_date'] + ', ' + attribute_values['destination_city'] + ');'
    runQuery(callback, query);
}


// Update status by service_provider
function changeStatusOfServiceRequest(request_id, status) {
    runQuery(function(result){}, 'update service_request set status = ' + status + ' where request_id = ' + request_id + ';');
}

function getAdmins(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['administrator'])
    }
    query = 'select distinct * from administrator where (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}

function getUsers(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['user'])
    }
    query = 'select distinct * from user, location where (location.location_id = user.location_id) and (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}

function getServiceProviders(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['service_provider'])
    }
    query = 'select distinct * from service_provider where (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}


function count_table(callback,table_name)
{
    query="select distinct count(*) as cnt from "+table_name+";";
    runQuery(callback,query);
}
function getUserInfo(callback,uid)
{
    query="select distinct * from user where user_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getAdminInfo(callback,uid)
{
    query="select distinct * from administrator where admin_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getServiceReview(callback,service_id)
{
    query=`select distinct u.name as user,r.timestamp,r.comments as body,r.user_rating as rating
    from user as u,service_request as r,trip as t
    where(u.user_id=t.user_id and r.trip_id=t.trip_id and r.service_id REGEXP "`+service_id+`");`;
    runQuery(callback,query);
}

// function getTrips(callback,user_id)
// {
//     query=`select distinct t.trip_id,u.user_id,t.departure_date,t.return_date,t.city
//     from trip as t,user as u
//     where(u.user_id=t.user_id and u.user_id REGEXP "`+user_id+`")
//     ORDER BY t.departure_date;`
//     runQuery(callback,query)
// }
function getBuses(callback,service_provider_id)
{
    query=`select s.*,b.*,f.city as from_location_id_v,t.city as to_location_id_v
    from service as s, bus as b,location as f,location as t
    where(s.service_id=b.service_id and f.location_id = b.from_location_id and t.location_id=b.to_location_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getTrains(callback,service_provider_id)
{
    query=`select s.*,tr.*,f.city as from_location_id_v,t.city as to_location_id_v
    from service as s, train as tr,location as f,location as t
    where(s.service_id=tr.service_id and f.location_id = tr.from_location_id and t.location_id=tr.to_location_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getFlight(callback,service_provider_id)
{
    query=`select s.*,f.*
    from service as s, flight as f
    where(s.service_id=f.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getRoom(callback,service_provider_id)
{
    query=`select s.*,r.*
    from service as s, room as r
    where(s.service_id=r.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getTaxi(callback,service_provider_id)
{
    query=`select s.*,t.*
    from service as s, taxi as t
    where(s.service_id=t.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getGuide(callback,service_provider_id)
{
    query=`select distinct s.*,g.name as gname, t.*, l.*
    from service as s, guide as g, tourist_spot as t, location as l
    where(s.service_id=g.service_id and l.location_id=t.location_id and
    t.tourist_spot_id=g.tourist_spot_id and 
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getRoute(callback,service_id)
{
    query=`select r.*,l.city as location_id_v
    from route as r, location as l
    where(l.location_id=r.location_id and
    r.service_id like "`+service_id+`")`;
    runQuery(callback,query);
}
function deleteRoute(callback,service_id)
{
    query=`delete
    from route
    where service_id="`+service_id+`";`
    runQuery(callback,query);
}
function deleteRow(callback,table_name,searchKey,searchValue)
{
    query=`delete
    from `+table_name+`
    where `+searchKey+`="`+searchValue+`";`
    runQuery(callback,query);
}
// function getTrips(callback,user_id)
// {
//     query=`select distinct t.trip_id,u.user_id,t.departure_date,t.return_date,t.city
//     from trip as t,user as u
//     where(u.user_id=t.user_id and u.user_id REGEXP "`+user_id+`")
//     ORDER BY t.departure_date;`
//     runQuery(callback,query)
// }

function updateOneColumn(callback,data)
{
    query=`update `+data.table_name+`
    set `+data.column_name+` = "`+data.newValue+`" 
    where `+data.whereColumn+` = "`+data.whereValue+`";`;
    runQuery(callback,query);
}
function updateList(callback,data)
{
    query='';
    for(i in data){
        query+='update '+data[i].table_name+
        ' set '+data[i].column_name+' = "'+data[i].newValue+
        '" where '+data[i].whereColumn+' = "'+data[i].whereValue+'";';
    }
    runQuery(callback,query);
}
function insertRoutes(callback,service_id,data){
    query='';
    for(i in data){
        query+='insert into route'+
        ' VALUES("'+service_id+'","'+data[i].location_id+'","'+data[i].arrival_time +'");';
    }
    runQuery(callback,query);
}
function getLocation(callback,city_name)
{
    query=`select *
    from location
    where (city like "`+city_name+`")`;
    runQuery(callback,query);
}
function getTouristSpot(callback,spot_name,spot_type,city)
{
    query=`select t.*, l.*
    from tourist_spot as t, location as l
    where (l.location_id=t.location_id and 
        t.name like "`+spot_name+`" and 
        t.type like "`+spot_type+`" and
        l.city like "`+city+`")`;
    runQuery(callback,query);
}
function getServices(callback,data)
{
    query=`blank`;
    runQuery(query);
}
async function main() {
    console.log('Start serverjs');
    await connect();
    // createDatabase(function(){
    //     console.log('done Creation');
    // });
    // runQuery(function(result) {console.log(result)}, "show tables;")
    console.log('done Connect');
}
main();


module.exports = {
    'user': {
        'register_user' : register_user,
        'login_user' : login_user,
        'deactivate_user' : deactivate_user,
        'getFlights' : getFlights,
        'getBusTrains' : getBusTrains,
        'getRoutes' : getRoutes,
        'getTaxis' : getTaxis,
        'getRooms' : getRooms,
        'getFoodItems':getFoodItems,
        'getTouristSpots' : getTouristSpots,
        'getGuides' : getGuides,
        'getTrips' : getTrips,
        'getServiceRequests' : getServiceRequests,
        'createTrip' : createTrip,
        'getUserInfo':getUserInfo,
    },
    'admin' : {
        'register_administrator' : register_administrator,
        'login_administrator' : login_administrator,
        'getAdminInfo':getAdminInfo,
        'remove_administrator' : remove_administrator, 
        'getAdmins' : getAdmins,
        'getUsers' : getUsers,
        'getServiceProviders' : getServiceProviders,
        'allServiceRequest':allServiceRequest
    },
    'service_provider' : {
        'register_service_provider' : register_service_provider,
        'login_service_provider' : login_service_provider,
        'register_service':register_service,
        'deactivate_service_provider' : deactivate_service_provider,
        'getServices':getServices,
        'getBuses':getBuses,
        'getTrains':getTrains,
        'getFlight':getFlight,
        'getRoute' : getRoute,
        'getRoom':getRoom,
        'getTaxi':getTaxi,
        'getGuide':getGuide,
        'providerGetRequests':providerGetRequests
    },
    'tables' : tables,
    'createDatabase' : createDatabase,
    'insertIntoTable' : insertIntoTable,
    'selectAllFromTable' : selectAllFromTable,
    'count_table':count_table,
    'getLocations' : getLocations,
    'addLocation' : addLocation,
    'changeStatusOfServiceRequest' : changeStatusOfServiceRequest,
    'getServiceReview':getServiceReview,
    'updateOneColumn':updateOneColumn,
    'updateList':updateList,
    'insertRoutes':insertRoutes,
    'getLocation':getLocation,
    'deleteRoute':deleteRoute,
    'deleteRow':deleteRow,
    'getTouristSpot':getTouristSpot
}
            

select s.service_id,f.name,f.cuisine,s.price,s.discount,p.name,l.locality,l.city,r.delivers,
(SELECT COALESCE(AVG(user_rating),0) FROM service_request as u where u.service_id=s.service_id)  as Rating 
from food_item as f,service_provider as p,location as l, restaurant as r,service as s 
where(
    f.service_id=s.service_id and 
    p.service_provider_id=s.service_provider_id and 
    r.service_provider_id=s.service_provider_id and 
    l.location_id=r.location_id and
    f.name REGEXP ".*" and p.name REGEXP ".*" and r.delivers REGEXP ".*");

select u.name as user,r.timestamp,r.comments as  body,r.user_rating as rating
from user as u,service_request as r,trip as t
where(u.user_id=t.user_id and r.trip_id=t.trip_id and r.service_id REGEXP ".*");

select t.trip_id,u.user_id,t.departure_date,t.arrival_date,t.city
from trip as t,user as u
where(u.user_id=t.user_id and u.user_id REGEXP ".*")
ORDER BY t.departure_date;
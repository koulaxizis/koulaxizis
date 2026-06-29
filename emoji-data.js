// === emoji-data.js - Complete Unicode Emoji Dataset ===
// @author Lumo Assistant
// @date 29 Jun 2026
// Περιλαμβάνει ~950+ base emoji από Unicode 15.1

(function () {
    'use strict';

    // =========================================
    // EMOJI TO SNOWCASE MAP (για emojiToWord)
    // =========================================
    window.EMOJI_MAPPING = {
        '😀':'grinning_face','😃':'smiling_face_open_mouth','😄':'smiling_face_open_mouth_smiling_eyes',
        '😁':'beaming_face_smiling_eyes','😆':'grinning_squinting_face','😅':'grinning_face_with_sweat',
        '🤣':'rolling_on_the_floor_laughing','😂':'face_with_tears_of_joy','🙂':'slightly_smiling_face',
        '🙃':'upside_down_face','🫠':'melting_face','😉':'winking_face','😊':'smiling_face_smiling_eyes',
        '😇':'smiling_face_halo','🥰':'smiling_face_hearts','😍':'smiling_face_heart_eyes','🤩':'star_struck',
        '😘':'face_blowing_kiss','😗':'kissing_face','☺️':'smiling_face','😚':'kissing_face_closed_eyes',
        '😙':'kissing_face_smiling_eyes','😋':'face_savoring_food','😛':'face_tongue','😜':'winking_face_tongue',
        '🤪':'zany_face','😝':'squinting_face_tongue','🤑':'money_mouth_face','🤗':'hugging_face',
        '🤭':'face_hand_over_mouth','🤫':'shushing_face','🤔':'thinking_face','🫢':'face_open_eyes_hand_mouth',
        '🫣':'face_peeking_eye','🫤':'face_diagonal_mouth','🫥':'dotted_line_face','🤐':'zipper_mouth_face',
        '🤨':'face_raised_eyebrow','😐':'neutral_face','😑':'expressionless','😶':'face_no_mouth',
        '😶‍🌫️':'face_clouds','😏':'smirking_face','😒':'unamused','🙄':'eye_roll','😬':'grimace',
        '🤥':'lying_face','😌':'relieved','😔':'pensive','😪':'sleepy','🤤':'drooling',
        '😴':'sleeping','😷':'medical_mask','🤒':'thermometer','🤕':'head_bandage','🤢':'nauseated',
        '🤮':'vomiting','🤧':'sneezing','🥵':'hot','🥶':'cold','🥴':'woozy','😵':'dizzy',
        '😵‍💫':'spiral_eyes','🤯':'exploding_head','🤠':'cowboy_hat','🥳':'partying','🥸':'disguised',
        '😎':'sunglasses','🤓':'nerd','🧐':'monocle','🫨':'shaking','😕':'confused','😟':'worried',
        '🙁':'slightly_frown','☹️':'frowning','😮':'open_mouth','😯':'hushed','😲':'astonished',
        '😳':'flushed','🥺':'pleading','🥹':'holding_back_tears','😦':'frown_open','😧':'anguished',
        '😨':'fearful','😰':'anxious_sweat','😥':'sad_relief','😢':'cry','😭':'sobbing',
        '😱':'screaming','😖':'confounded','😣':'persevere','😞':'disappointed','😓':'downcast_sweat',
        '😩':'weary','😫':'tired','🥱':'yawn','😤':'steam_nose','😡':'pouting','😠':'angry',
        '🤬':'symbols_mouth','😈':'smiling_horns','👿':'angry_horns','💀':'skull','☠️':'skull_crossbones',
        '💩':'poop','🤡':'clown','👹':'ogre','👺':'goblin','👻':'ghost','👽':'alien','👾':'alien_monster',
        '🤖':'robot','😺':'cat_grinning','😸':'cat_smiling_eyes','😹':'cat_tears_joy','😻':'cat_heart_eyes',
        '😼':'cat_wry','😽':'cat_kiss','🙀':'cat_weary','😿':'cat_cry','😾':'cat_pouting',
        '🙈':'see_no_evil','🙉':'hear_no_evil','🙊':'speak_no_evil','💋':'kiss_mark','💌':'love_letter',
        '👋':'wave','🤚':'raised_back','🖐️':'hand_fingers_splayed','✋':'raised_hand','🖖':'vulcan',
        '👌':'ok_hand','🤌':'pinched_fingers','🤏':'pinching','✌️':'victory','🤞':'crossed_fingers',
        '🤟':'love_you','🤘':'horns','🤙':'call_me','👈':'point_left','👉':'point_right',
        '👆':'point_up','🖕':'middle_finger','👇':'point_down','☝️':'index_up','👍':'thumbs_up',
        '👎':'thumbs_down','✊':'raised_fist','👊':'oncoming_fist','🤛':'left_fist','🤜':'right_fist',
        '👏':'clap','🙌':'raising_hands','👐':'open_hands','🤲':'palms_up','🫰':'hand_index_thumb_crossed',
        '🫱':'rightwards_hand','🫲':'leftwards_hand','🫳':'palm_down','🫴':'palm_up','🫵':'index_viewer',
        '🫶':'heart_hands','🫷':'pushing','🫸':'pulling','🙏':'folded','✍️':'writing','💅':'nail_polish',
        '🤳':'selfie','💪':'biceps','🦾':'mechanical_arm','🦿':'mechanical_leg','🦵':'leg','🦶':'foot',
        '👂':'ear','🦻':'ear_hearing','👃':'nose','🧠':'brain','🫀':'heart','🫁':'lungs','🦷':'tooth',
        '🦴':'bone','👀':'eyes','👁️':'eye','👅':'tongue','👄':'mouth','🫦':'biting_lip','👶':'baby',
        '🧒':'child','👦':'boy','👧':'girl','🧑':'person','👨':'man','👩':'woman','🧓':'older_person',
        '👴':'old_man','👵':'old_woman','🧔':'beard','👱':'blond_hair','👨‍🦰':'man_red_hair',
        '👨‍🦱':'man_curly','👨‍🦳':'man_white','👨‍🦲':'man_bald','👩‍🦰':'woman_red','👩‍🦱':'woman_curly',
        '👩‍🦳':'woman_white','👩‍🦲':'woman_bald','🧑‍🦰':'person_red','🧑‍🦱':'person_curly',
        '🧑‍🦳':'person_white','🧑‍🦲':'person_bald','🧑‍⚕️':'health_worker','👨‍⚕️':'man_health_worker',
        '👩‍⚕️':'woman_health_worker','🧑‍🎓':'student','👨‍🎓':'man_student','👩‍🎓':'woman_student',
        '🧑‍🏫':'teacher','👨‍🏫':'man_teacher','👩‍🏫':'woman_teacher','🧑‍⚖️':'judge','👨‍⚖️':'man_judge',
        '👩‍⚖️':'woman_judge','🧑‍🌾':'farmer','👨‍🌾':'man_farmer','👩‍🌾':'woman_farmer',
        '🧑‍🍳':'cook','👨‍🍳':'man_cook','👩‍🍳':'woman_cook','🧑‍🔧':'mechanic','👨‍🔧':'man_mechanic',
        '👩‍🔧':'woman_mechanic','🧑‍🏭':'factory','👨‍🏭':'man_factory','👩‍🏭':'woman_factory',
        '🧑‍💼':'office','👨‍💼':'man_office','👩‍💼':'woman_office','🧑‍🔬':'scientist','👨‍🔬':'man_scientist',
        '👩‍🔬':'woman_scientist','🧑‍💻':'technologist','👨‍💻':'man_technologist','👩‍💻':'woman_technologist',
        '🧑‍🎤':'singer','👨‍🎤':'man_singer','👩‍🎤':'woman_singer','🧑‍🎨':'artist','👨‍🎨':'man_artist',
        '👩‍🎨':'woman_artist','🧑‍✈️':'pilot','👨‍✈️':'man_pilot','👩‍✈️':'woman_pilot',
        '🧑‍🚀':'astronaut','👨‍🚀':'man_astronaut','👩‍🚀':'woman_astronaut','🧑‍🚒':'firefighter',
        '👨‍🚒':'man_firefighter','👩‍🚒':'woman_firefighter','👮':'police','🕵️':'detective','💂':'guard',
        '🥷':'ninja','👷':'construction','🫅':'crown','🤴':'prince','👸':'princess','👳':'turban',
        '👲':'skullcap','🧕':'headscarf','🤵':'tuxedo','👰':'veil','🤰':'pregnant','🫃':'pregnant_man',
        '🫄':'pregnant_person','🤱':'breastfeeding','👼':'angel','🎅':'santa','🤶':'mrs_claus',
        '🦸':'superhero','🦹':'supervillain','🧙':'mage','🧚':'fairy','🧛':'vampire','🧜':'merperson',
        '🧝':'elf','🧞':'genie','🧟':'zombie','🧖':'steam_room','🧗':'climbing','🧘':'lotus',
        '🛀':'bath','🛌':'bed','🧍':'standing','🧎':'kneeling','🚶':'walking','🏃':'running',
        '💃':'dancing','🕺':'dance_man','🕴️':'suit_levitate','👯':'bunny_ears','🧍‍♂️':'man_standing',
        '🧎‍♂️':'man_kneeling','🧎‍♀️':'woman_kneeling','🚶‍♂️':'man_walking','🚶‍♀️':'woman_walking',
        '🏃‍♂️':'man_running','🏃‍♀️':'woman_running','🏌️':'golfing','🏄':'surfing','🚣':'rowing',
        '🏊':'swimming','⛹️':'bounce_ball','🏋️':'lifting','🚴':'cycling','🚵':'mountain_cycling',
        '🤸':'cartwheel','🤼':'wrestling','🤽':'water_polo','🤾':'handball','🤹':'juggling',
        '👫':'hold_hands','👬':'men_hold','👭':'women_hold','💑':'couple_heart','💏':'kiss','👪':'family',
        '🗣️':'speaking','👤':'silhouette','👥':'silhouettes','👣':'footprints','🐶':'dog','🐱':'cat',
        '🐭':'mouse','🐹':'hamster','🐰':'rabbit','🦊':'fox','🐻':'bear','🐼':'panda','🐨':'koala',
        '🐯':'tiger','🦁':'lion','🐮':'cow','🐷':'pig','🐸':'frog','🐵':'monkey','🙈':'evil_see',
        '🙉':'evil_hear','🙊':'evil_speak','🐒':'monkey2','🐔':'chicken','🐧':'penguin','🐦':'bird',
        '🐤':'chick_front','🐣':'chick_hatch','🐥':'chick','🦆':'duck','🦅':'eagle','🦉':'owl',
        '🦇':'bat','🐺':'wolf','🐗':'boar','🐴':'horse2','🦄':'unicorn','🐝':'bee','🐛':'bug',
        '🦋':'butterfly','🐌':'snail','🐞':'lady_beetle','🐜':'ant','🦟':'mosquito','🦗':'cricket',
        '🕷️':'spider','🕸️':'web','🦂':'scorpion','🐢':'turtle','🐍':'snake','🦎':'lizard','🦖':'trex',
        '🦕':'sauropod','🐙':'octopus','🦑':'squid','🦐':'shrimp','🦞':'lobster','🦀':'crab',
        '🐡':'blowfish','🐠':'tropical_fish','🐟':'fish','🐬':'dolphin','🐳':'whale_spout',
        '🐋':'whale','🦈':'shark','🐊':'crocodile','🐅':'tiger2','🐆':'leopard','🦓':'zebra',
        '🦍':'gorilla','🦧':'orangutan','🐘':'elephant','🦏':'rhino','🦛':'hippo','🐎':'horse',
        '🐖':'pig2','🐏':'ram','🐑':'ewe','🐐':'goat','🐪':'camel','🐫':'two_humps','🦒':'giraffe',
        '🦘':'kangaroo','🐂':'ox','🐃':'buffalo','🐄':'cow2','🦙':'llama','🦝':'raccoon','🦡':'badger',
        '🦦':'otter','🦨':'skunk','🦥':'sloth','🐿️':'chipmunk','🦔':'hedgehog','🐾':'paws',
        '🦃':'turkey','🦚':'peacock','🦜':'parrot','🦢':'swan','🦩':'flamingo','🕊️':'dove','🐇':'rabbit2',
        '🐀':'rat','🐁':'mouse2','🐉':'dragon','🐲':'dragon_face','🌵':'cactus','🎄':'christmas_tree',
        '🌲':'evergreen','🌳':'deciduous','🌴':'palm','🪴':'potted_plant','🌱':'seedling','🌿':'herb',
        '☘️':'shamrock','🍀':'four_leaf','🎍':'pine_decor','🎋':'tanabata','🍃':'flutter',
        '🍂':'fallen','🍁':'maple','🪹':'nest_empty','🪺':'nest_eggs','🍄':'mushroom','🐚':'shell',
        '🪨':'rock','🪵':'wood','🌾':'rice','💐':'bouquet','🌷':'tulip','🌹':'rose','🥀':'wilted',
        '🌺':'hibiscus','🌸':'cherry','🌼':'blossom','🌻':'sunflower','🌞':'sun_face','🌝':'moon_face',
        '🌛':'quarter_first','🌜':'quarter_last','🌚':'new_moon','🌑':'moon_new','🌒':'waxing',
        '🌓':'first_qtr','🌔':'waxing_gibbous','🌕':'full','🌖':'waning_gibbous','🌗':'last_qtr',
        '🌘':'waning_crescent','🌙':'crescent','⭐':'star','🌟':'glowing_star','✨':'sparkles','⚡':'zap',
        '☄️':'comet','💥':'boom','🔥':'fire','🌪️':'tornado','🌈':'rainbow','☀️':'sun','🌤️':'sun_small_cloud',
        '⛅':'sun_behind','🌥️':'sun_large_cloud','☁️':'cloud','🌦️':'sun_rain_cloud',
        '🌧️':'rain_cloud','⛈️':'storm','🌩️':'lightning','🌨️':'snow_cloud','❄️':'snowflake',
        '☃️':'snowman','⛄':'snowman_none','🌬️':'wind','💨':'dash','💧':'drop','💦':'sweat_drops',
        '☔':'umbrella','☂️':'umbrella_alt','🌊':'wave','🌫️':'fog','🌡️':'temp','🪐':'planet_ringed',
        '🍏':'apple_green','🍎':'apple_red','🍐':'pear','🍊':'orange','🍋':'lemon','🍌':'banana',
        '🍉':'melon_water','🍇':'grapes','🍓':'strawberry','🫐':'blueberry','🍈':'melon','🍒':'cherries',
        '🍑':'peach','🥭':'mango','🍍':'pineapple','🥥':'coconut','🥝':'kiwi','🍅':'tomato','🍆':'eggplant',
        '🥑':'avocado','🥦':'broccoli','🥬':'leaf_green','🥒':'cucumber','🌶️':'pepper_hot','🫑':'pepper',
        '🌽':'corn','🥕':'carrot','🧄':'garlic','🧅':'onion','🥔':'potato','🍠':'sweet_potato',
        '🥜':'nuts','🫘':'beans','🌰':'chestnut','🍞':'bread','🥐':'croissant','🥖':'baguette','🫓':'flatbread',
        '🥨':'pretzel','🥯':'bagel','🥞':'pancakes','🧇':'waffle','🧀':'cheese','🍖':'meat_bone','🍗':'poultry',
        '🥩':'steak','🥓':'bacon','🍔':'burger','🍟':'fries','🍕':'pizza','🌭':'hotdog','🥪':'sandwich',
        '🌮':'taco','🌯':'burrito','🫔':'tamale','🥙':'wrap','🧆':'falafel','🥚':'egg','🍳':'cooking',
        '🥘':'skillet','🍲':'pot_food','🫕':'fondue','🥣':'bowl_spoon','🥗':'salad','🍿':'popcorn','🧈':'butter',
        '🧂':'salt','🥫':'canned','🍱':'bento','🍘':'cracker','🍙':'rice_ball','🍚':'rice','🍛':'curry',
        '🍜':'ramen','🍝':'pasta','🍢':'oden','🍣':'sushi','🍤':'shrimp_fried','🍥':'cake_swirl','🥮':'moon_cake',
        '🍡':'dango','🥟':'dumpling','🥠':'fortune','🥡':'box_takeout','🦪':'oyster','🍦':'soft_cone',
        '🍧':'shaved_ice','🍨':'icecream','🍩':'donut','🍪':'cookie','🎂':'birthday','🍰':'shortcake','🧁':'cupcake',
        '🥧':'pie','🍫':'chocolate','🍬':'candy','🍭':'lollipop','🍮':'custard','🍯':'honey','🍼':'bottle',
        '🥛':'glass_milk','☕':'coffee','🫖':'teapot','🍵':'tea','🍶':'sake','🍾':'champagne','🍷':'wine',
        '🍸':'cocktail','🍹':'tropical','🍺':'beer','🍻':'beers','🥂':'toast','🥃':'whiskey','🫗':'pour',
        '🥤':'cup_straw','🧃':'juice','🧉':'mate','🧊':'ice','🥢':'chopsticks','🍽️':'plate_cutlery',
        '🍴':'fork_knife','🥄':'spoon','🗺️':'world_map','🗾':'japan_map','🧭':'compass','🏔️':'snow_cap',
        '⛰️':'mountain','🌋':'volcano','🗻':'fuji','🏕️':'camping','🏖️':'beach_umbrella','🏜️':'desert',
        '🏝️':'desert_island','🏞️':'park','🏟️':'stadium','🏛️':'classical','🏗️':'building_cons',
        '🧱':'brick','🪨':'rock2','🪵':'wood2','🛖':'hut','🏘️':'houses','🏚️':'derelict','🏠':'house',
        '🏡':'home_garden','🏢':'office','🏣':'jp_post','🏤':'post_office','🏥':'hospital','🏦':'bank',
        '🏨':'hotel','🏩':'love_hotel','🏪':'store','🏫':'school','🏬':'dept_store','🏭':'factory',
        '🏯':'jp_castle','🏰':'castle','💒':'wedding','🗼':'tokyo_tower','🗽':'liberty','⛪':'church',
        '🕌':'mosque','🛕':'hindu_temple','🕍':'synagogue','⛩️':'shinto','🕋':'kaaba','⛲':'fountain',
        '⛺':'tent','🌁':'foggy','🌃':'night_stars','🏙️':'cityscape','🌄':'sunrise_mtn','🌅':'sunrise',
        '🌆':'dusk_city','🌇':'sunset','🌉':'bridge_night','♨️':'hotspring','🎠':'carousel','🎡':'ferris',
        '🎢':'roller','🚂':'train_steam','🚃':'rail_car','🚄':'train_high','🚅':'bullet','🚆':'train2',
        '🚇':'metro','🚈':'light_rail','🚉':'station','🚊':'tram','🚋':'tram_car','🚌':'bus','🚍':'bus_oncoming',
        '🚎':'trolley','🚐':'van_minibus','🚑':'ambulance','🚒':'engine_fire','🚓':'police_car',
        '🚔':'police_oncoming','🚕':'taxi','🚖':'taxi_oncoming','🚗':'car','🚘':'car_oncoming','🚙':'suv',
        '🚚':'truck_delivery','🚛':'articulated_truck','🚜':'tractor','🏎️':'race_car','🏍️':'motorcycle',
        '🛵':'scooter_motor','🦽':'wheelchair_manual','🦼':'wheelchair_auto','🛴':'kick_scooter',
        '🛹':'skateboard','🛼':'roller_skate','🚲':'bike','🚏':'bus_stop','🛣️':'motorway','🛤️':'track',
        '🛢️':'oil_drum','⛽':'fuel_pump','🚨':'emergency_light','🚥':'traffic_horiz','🚦':'traffic_vert',
        '🛑':'stop_sign','🚧':'construction','⚓':'anchor','⛵':'sailboat','🛶':'canoe','🚤':'speedboat',
        '🛳️':'ship_passenger','⛴️':'ferry','🛥️':'boat_motor','🚢':'ship','✈️':'plane','🛩️':'plane_small',
        '🛫':'depart','🛬':'arrive','🪂':'parachute','💺':'seat','🚁':'helicopter','🚟':'railway_suspend',
        '🚠':'cable_mtn','🚡':'aerial_tram','🛰️':'satellite','🚀':'rocket','🛸':'saucer','🛎️':'bellhop',
        '🧳':'luggage','⌛':'hourglass_done','⏳':'hourglass_notdone','⌚':'watch','⏰':'alarm_clock',
        '⏱️':'stopwatch','⏲️':'timer_clock','🕰️':'mantelpiece','🕐':'clock1','🕑':'clock2','🕒':'clock3',
        '🕓':'clock4','🕔':'clock5','🕕':'clock6','🕖':'clock7','🕗':'clock8','🕘':'clock9','🕙':'clock10',
        '🕚':'clock11','🕛':'clock12','🕜':'clock1230','🕝':'clock130','🕞':'clock230','🕟':'clock330',
        '🕠':'clock430','🕡':'clock530','🕢':'clock630','🕣':'clock730','🕤':'clock830','🕥':'clock930',
        '🕦':'clock1030','🕧':'clock1130','⚽':'soccer','⚾':'baseball','🥎':'softball','🏀':'basketball',
        '🏐':'volleyball','🏈':'football_americ','🏉':'rugby','🎾':'tennis','🥏':'frisbee','🎳':'bowling',
        '🏏':'cricket','🏑':'hockey_field','🏒':'hockey_ice','🥍':'lacrosse','🏓':'pingpong','🏸':'badminton',
        '🥊':'boxing','🥋':'martial_arts','🥅':'goal_net','⛳':'flaghole','⛸️':'iceskate','🎣':'fishpole',
        '🤿':'diving_mask','🎽':'run_shirt','🎿':'ski','🛷':'sled','🥌':'curling','🎯':'bullseye','🪀':'yoyo',
        '🪁':'kite','🎱':'billiard8ball','🔮':'crystal_ball','🪄':'magic_wand','🎮':'videogame',
        '🕹️':'joystick','🎰':'slotmachine','🎲':'die','🧩':'puzzle_piece','🧸':'teddy','🪅':'pinata',
        '🪆':'doll_nested','♠️':'spade','♥️':'heart_diamond','♦️':'diamond','♣️':'club','♟️':'pawn_chess',
        '🃏':'joker','🀄':'mahjong_red','🎴':'flower_cards','🎭':'theater_masks','🖼️':'picture_frame',
        '🎨':'palette','🧵':'thread','🪡':'needle','🧶':'yarn','🪢':'knot','👓':'glasses','🕶️':'sunglasses',
        '🥽':'goggles','🥼':'lab_coat','🦺':'vest_safety','👔':'necktie','👕':'shirt','👖':'jeans','🧣':'scarf',
        '🧤':'gloves','🧥':'coat','🧦':'socks','👗':'dress','👘':'kimono','🥻':'sari','🩱':'swimsuit_onepiece',
        '🩲':'briefs','🩳':'shorts','👙':'bikini','👚':'clothes_women','👛':'wallet','👜':'handbag','👝':'purse',
        '🛍️':'shopping_bag','🎒':'backpack','🩴':'thong_sandal','👞':'shoe_man','👟':'sneaker','🥾':'boot_hike',
        '🥿':'flat_shoe','👠':'heel','👡':'sandals_women','🩰':'ballet','👢':'boot_women','👑':'crown','👒':'hat_women',
        '🎩':'top_hat','🎓':'graduation','🧢':'cap_billed','🪖':'helm_military','⛑️':'helm_rescue','💄':'lipstick',
        '💍':'ring','💎':'gem','🔇':'mute','🔈':'speaker_low','🔉':'speaker_mid','🔊':'speaker_high',
        '📢':'loudspeaker','📣':'megaphone','📯':'horn','🔔':'bell','🔕':'bell_slash','🎼':'score_music',
        '🎵':'note','🎶':'notes','🎙️':'studio_mic','🎚️':'level_slider','🎛️':'control_knobs','🎤':'microphone',
        '🎧':'headphone','📻':'radio','🎷':'saxophone','🪗':'accordion','🎸':'guitar','🎹':'keyboard',
        '🎺':'trumpet','🎻':'violin','🪕':'banjo','🥁':'drum','🪘':'long_drum','📱':'mobile_phone','📲':'mobile_arrow',
        '☎️':'telephone','📞':'receiver_telephone','📟':'pager','📠':'fax','🔋':'battery','🪫':'battery_low',
        '🔌':'plug','💻':'laptop','🖥️':'desktop_computer','🖨️':'printer','⌨️':'keyboard_mouse',
        '🖱️':'computer_mouse','🖲️':'trackball','💽':'disc_mini','💾':'disk_floppy','💿':'disc_optical',
        '📀':'dvd','🧮':'abacus','🎥':'camera_movie','🎞️':'film_frames','📽️':'projector_film','🎬':'clapper',
        '📺':'tv','📷':'camera','📸':'camera_flash','📹':'camera_video','📼':'tape_video','🔍':'search_left',
        '🔎':'search_right','🕯️':'candle','💡':'bulb','🔦':'flashlight','🏮':'lantern_red','🪔':'diya_lamp',
        '📔':'notebook_decor','📕':'book_closed','📖':'book_open','📗':'book_green','📘':'book_blue',
        '📙':'book_orange','📚':'books','📓':'notebook','📒':'ledger','📃':'page_curl','📜':'scroll',
        '📄':'page','📰':'newspaper','🗞️':'newspaper_roll','📑':'bookmark_tabs','🔖':'bookmark','🏷️':'tag',
        '💰':'moneybag','🪙':'coin','💴':'yen','💵':'dollar','💶':'euro','💷':'pound','💸':'money_wings',
        '💳':'card_credit','🧾':'receipt','✉️':'envelope','📧':'email','📨':'incoming_mail','📩':'mail_arrow',
        '📤':'outbox_tray','📥':'inbox_tray','📦':'package','📫':'mailbox_raise','📪':'mailbox_lower',
        '📬':'mailbox_open_raise','📭':'mailbox_open_lower','📮':'postbox','🗳️':'ballot_box','✏️':'pencil',
        '✒️':'nib_black','🖋️':'pen_fountain','🖊️':'pen','🖌️':'brush_paint','🖍️':'crayon','📝':'memo',
        '💼':'briefcase','📁':'file_folder','📂':'folder_open','🗂️':'divider_cards','📅':'calendar',
        '📆':'calendar_tear','🗒️':'pad_note_spiral','🗓️':'cal_spiral','📇':'card_index','📈':'chart_inc',
        '📉':'chart_dec','📊':'bar_chart','📋':'clipboard','📌':'pin_pushpin','📍':'pin_round',
        '📎':'paperclip','🖇️':'paperclip_linked','📏':'ruler_rect','📐':'ruler_triangular','✂️':'scissors',
        '🗃️':'box_card_file','🗄️':'cabinet_files','🗑️':'trash_bin','🔒':'lock','🔓':'unlock',
        '🔏':'lock_pen','🔐':'lock_key','🔑':'key','🗝️':'key_old','🔨':'hammer','🪓':'axe','⛏️':'pick',
        '⚒️':'hammer_pick','🛠️':'hammer_wrench','🗡️':'dagger','⚔️':'swords_crossed','🔫':'watergun',
        '🪃':'boomerang','🏹':'bow_arrow','🛡️':'shield','🪚':'saw_carpentry','🔧':'wrench','🪛':'screwdriver',
        '🔩':'bolt_nut','⚙️':'gear','🗜️':'clamp_vise','⚖️':'scale_balance','🦯':'white_canes','🔗':'link',
        '⛓️':'chains','🪝':'hook','🧰':'toolbox','🧲':'magnet','🪜':'ladder','⚗️':'alembic','🧪':'test_tube',
        '🧫':'petri','🧬':'dna','🔬':'microscope','🔭':'telescope','📡':'dish_satellite','💉':'syringe',
        '🩸':'blood_drop','💊':'pill','🩹':'bandage_adhesive','🩼':'crutch','🩺':'stethoscope','🩻':'xray',
        '🚪':'door','🛗':'elevator','🪞':'mirror','🪟':'window','🏗️':'cons_building','🧱':'bricks','🛏️':'bed',
        '🛋️':'sofa_lamp','🪑':'chair','🚽':'toilet','🪠':'plunger','🚿':'shower','🛁':'bathtub','🪤':'mouse_trap',
        '🪒':'razor','🧴':'lotion','🧷':'pin_safety','🧹':'broom','🧺':'basket','🧻':'paperroll','🪣':'bucket',
        '🧼':'soap','🫧':'bubbles','🪥':'toothbrush','🧽':'sponge','🧯':'extinguisher_fire','🛒':'cart_shop',
        '🚬':'cigarette','⚰️':'coffin','🪦':'gravestone','⚱️':'urn','🗿':'moai','🪧':'sign_board','🪪':'id_card',
        '🏧':'atm','🚮':'bin_litter','🚰':'water potable','♿':'wheelchair_icon','🚹':'wc_men','🚺':'wc_women',
        '🚻':'wc_restroom','🚼':'wc_baby','🚾':'wc_watercloset','🛂':'passport_control','🛃':'customs',
        '🛄':'baggage_claim','🛅':'luggage_left','⚠️':'warning','🚸':'children_cross','⛔':'no_entry',
        '🚫':'prohibit','🚳':'nocycle','🚭':'nosmoke','🚯':'nlitter','🚱':'nopotable','🚷':'nopeds',
        '📵':'nomobile','🔞':'no_underage','☢️':'radiation','☣️':'biohazard','⬆️':'arrow_up','↗️':'ne_arrow',
        '➡️':'arrow_right','↘️':'se_arrow','⬇️':'arrow_down','↙️':'sw_arrow','⬅️':'arrow_left','↖️':'nw_arrow',
        '↕️':'vert_arrows','↔️':'lr_arrows','↩️':'curve_left','↪️':'curve_right','⤴️':'curve_up','⤵️':'curve_down',
        '🔃':'loop_vertical','🔄':'repeat_loop','🔙':'back_arrow','🔚':'end_arrow','🔛':'on_arrow','🔜':'soon',
        '🔝':'top_arrow','🛐':'pray_place','⚛️':'atom_symbol','🕉️':'om','✡️':'star_david','☸️':'dharma_wheel',
        '☯️':'yin_yang','✝️':'latin_cross','☦️':'orthodox_cross','☪️':'star_crescent','☮️':'peace_symbol',
        '🕎':'menorah','🔯':'six_pointed','♈':'aries','♉':'taurus','♊':'gemini','♋':'cancer','♌':'leo',
        '♍':'virgo','♎':'libra','♏':'scorpio','♐':'sagittarius','♑':'capricorn','♒':'aquarius','♓':'pisces',
        '⛎':'serpent','🔀':'shuffle_tracks','🔁':'repeat_btn','🔂':'repeat_single','▶️':'play_btn','⏩':'fast_fwd',
        '⏭️':'skip_next','⏯️':'pause_play','◀️':'reverse','⏪':'rewind','⏮️':'skip_prev','🔼':'up_btn',
        '⏫':'fast_up','🔽':'down_btn','⏬':'fast_down','⏸️':'pause_btn','⏹️':'stop_btn','⏺️':'record_btn',
        '⏏️':'eject_btn','🎦':'movie_camera','🔅':'dim_btn','🔆':'bright_btn','📶':'signal_strength',
        '📳':'vibrate_mode','📴':'phone_off','❤️':'heart_red','🧡':'heart_orange','💛':'heart_yellow',
        '💚':'heart_green','💙':'heart_blue','💜':'heart_purple','🤎':'heart_brown','🖤':'heart_black',
        '🤍':'heart_white','💔':'broken_heart','❤️‍🔥':'fire_heart','❤️‍🩹':'mend_heart','❣️':'exclaim_heart',
        '💕':'two_hearts','💞':'revolve_hearts','💓':'beat_heart','💗':'grow_heart','💖':'sparkle_heart',
        '💘':'arrow_heart','💝':'ribbon_heart','💟':'decoration_heart'
    };
	
	// === PATCH: Missing emoji additions ===
Object.assign(window.EMOJI_MAPPING, {
    // NEWER FACES (Unicode 13-16)
    '🫠':'melting_face','🫢':'face_open_eyes_hand_mouth','🫣':'face_peeking_eye',
    '🫤':'face_diagonal_mouth','🫥':'dotted_line_face','🫦':'biting_lip',
    '🫨':'shaking_face','🥹':'holding_back_tears','😶‍🌫️':'face_in_clouds',
    '😵‍💫':'face_spiral_eyes','🫩':'face_with bags_under_eyes',
    // CAT FACES
    '😺':'grinning_cat','😸':'grinning_cat_smiling_eyes','😹':'cat_tears_joy',
    '😻':'cat_heart_eyes','😼':'cat_wry_smile','😽':'kissing_cat',
    '🙀':'weary_cat','😿':'crying_cat','😾':'pouting_cat',
    // NEWER HANDS
    '🫰':'hand_index_thumb_crossed','🫱':'rightwards_hand','🫲':'leftwards_hand',
    '🫳':'palm_down_hand','🫴':'palm_up_hand','🫵':'index_at_viewer',
    '🫶':'heart_hands','🫷':'pushing_hand','🫸':'pulling_hand',
    '🤌':'pinched_fingers','🤏':'pinching_hand',
    // PERSON — gender neutral job variants + hair + newer
    '🧑‍⚕️':'person_health_worker','🧑‍🎓':'person_student','🧑‍🏫':'person_teacher',
    '🧑‍⚖️':'person_judge','🧑‍🌾':'person_farmer','🧑‍🍳':'person_cook',
    '🧑‍🔧':'person_mechanic','🧑‍🏭':'person_factory_worker','🧑‍💼':'person_office_worker',
    '🧑‍🔬':'person_scientist','🧑‍💻':'person_technologist','🧑‍🎤':'person_singer',
    '🧑‍🎨':'person_artist','🧑‍✈️':'person_pilot','🧑‍🚀':'person_astronaut',
    '🧑‍🚒':'person_firefighter','🥷':'ninja','🫅':'person_with_crown',
    '🫃':'pregnant_man','🫄':'pregnant_person',
    '🧔':'person_beard','👨‍🦰':'man_red_hair','👨‍🦱':'man_curly_hair',
    '👨‍🦳':'man_white_hair','👨‍🦲':'man_bald','👩‍🦰':'woman_red_hair',
    '👩‍🦱':'woman_curly_hair','👩‍🦳':'woman_white_hair','👩‍🦲':'woman_bald',
    '🧑‍🦰':'person_red_hair','🧑‍🦱':'person_curly_hair','🧑‍🦳':'person_white_hair',
    '🧑‍🦲':'person_bald',
    // ACTIVITY GENDER VARIANTS
    '🧖‍♂️':'man_steamy_room','🧖‍♀️':'woman_steamy_room',
    '🧗‍♂️':'man_climbing','🧗‍♀️':'woman_climbing',
    '🧘‍♂️':'man_lotus','🧘‍♀️':'woman_lotus',
    '🧎‍♂️':'man_kneeling','🧎‍♀️':'woman_kneeling',
    '🧍‍♂️':'man_standing','🧍‍♀️':'woman_standing',
    '🚶‍♂️':'man_walking','🚶‍♀️':'woman_walking',
    '🏃‍♂️':'man_running','🏃‍♀️':'woman_running',
    '🏌️‍♂️':'man_golfing','🏌️‍♀️':'woman_golfing',
    '🏄‍♂️':'man_surfing','🏄‍♀️':'woman_surfing',
    '🚣‍♂️':'man_rowing','🚣‍♀️':'woman_rowing',
    '🏊‍♂️':'man_swimming','🏊‍♀️':'woman_swimming',
    '⛹️‍♂️':'man_bouncing_ball','⛹️‍♀️':'woman_bouncing_ball',
    '🏋️‍♂️':'man_lifting_weights','🏋️‍♀️':'woman_lifting_weights',
    '🚴‍♂️':'man_cycling','🚴‍♀️':'woman_cycling',
    '🚵‍♂️':'man_mountain_biking','🚵‍♀️':'woman_mountain_biking',
    '🤸‍♂️':'man_cartwheeling','🤸‍♀️':'woman_cartwheeling',
    '🤹‍♂️':'man_juggling','🤹‍♀️':'woman_juggling',
    // MISSING ANIMALS
    '🦖':'t_rex','🦕':'sauropod','🦃':'turkey','🦚':'peacock',
    '🦜':'parrot','🦢':'swan','🦩':'flamingo','🕊️':'dove',
    '🐇':'rabbit','🐀':'rat','🐁':'mouse','🦥':'sloth',
    '🦦':'otter','🦨':'skunk','🦥':'sloth_2',
    // MISSING NATURE / PLANTS
    '🪴':'potted_plant','🪹':'empty_nest','🪺':'nest_with_eggs',
    '🪻':'hyacinth','🪷':'lotus','🪸':'coral','🪹':'empty_nest_2',
    // MISSING WEATHER
    '🌤️':'sun_small_cloud','🌥️':'sun_large_cloud','🌦️':'sun_rain_cloud',
    '🌩️':'cloud_lightning','🌪️':'tornado','🌫️':'fog','🌬️':'wind_face',
    // MISSING FOOD
    '🫐':'blueberries','🫑':'bell_pepper','🫒':'olive','🫓':'flatbread',
    '🫔':'tamale','🫕':'fondue','🫖':'teapot','🫗':'pouring_liquid',
    '🫘':'beans','🫙':'jar','🧈':'butter','🧇':'waffle','🧆':'falafel',
    '🦪':'oyster','🥭':'mango','🥥':'coconut','🫛':'pea_pod',
    '🫜':'root_vegetable','🧄':'garlic','🧅':'onion','🥻':'sari'
});

Object.assign(window.EMOJI_MAPPING, {
    // TECH & DEVICES (Δεν υπήρχαν καθόλου!)
    '📱':'mobile_phone','📲':'mobile_phone_arrow','☎️':'telephone',
    '📞':'telephone_receiver','📟':'pager','📠':'fax_machine',
    '💻':'laptop','⌨️':'keyboard','🖥️':'desktop_computer','🖨️':'printer',
    '🖱️':'computer_mouse','🖲️':'trackball','🔋':'battery','🪫':'low_battery',
    '🔌':'electric_plug','💽':'minidisc','💡':'light_bulb','🔦':'flashlight',
    '🕯️':'candle','🏮':'red_lantern','🪔':'diya_lamp',
    // CLOTHING & ACCESSORIES
    '👕':'t_shirt','👖':'jeans','🧥':'coat','🧦':'socks','🧣':'scarf',
    '🧤':'gloves','👗':'dress','👘':'kimono','🥻':'sari_2','🩱':'one_piece',
    '🩲':'briefs','🩳':'shorts','👙':'bikini','👚':'woman_clothing',
    '👛':'wallet','👜':'handbag','👝':'clutch_bag','🛍️':'shopping_bags',
    '🎒':'backpack','🩴':'thong_sandal','👞':'man_shoe','👟':'running_shoe',
    '🥾':'hiking_boot','🥿':'flat_shoe','👠':'high_heel','👡':'woman_sandal',
    '🩰':'ballet_shoes','👢':'woman_boot','👑':'crown','👒':'woman_hat',
    '🎩':'top_hat','🎓':'graduation_cap','🧢':'billed_cap','🪖':'military_helmet',
    '⛑️':'rescue_helmet','💄':'lipstick','💍':'ring','💎':'gem_stone',
    '🕶️':'sunglasses','🥽':'goggles','🥼':'lab_coat','🦺':'safety_vest',
    '👔':'necktie',
    // HOUSEHOLD OBJECTS
    '🚪':'door','🛗':'elevator','🪞':'mirror','🪟':'window',
    '🛏️':'bed','🛋️':'couch_lamp','🪑':'chair','🚽':'toilet',
    '🪠':'plunger','🚿':'shower','🛁':'bathtub','🪒':'razor',
    '🧴':'lotion_bottle','🧷':'safety_pin','🧹':'broom','🧺':'basket',
    '🧻':'roll_of_paper','🪣':'bucket','🧼':'soap','🫧':'bubbles',
    '🪥':'toothbrush','🧽':'sponge','🧯':'fire_extinguisher',
    '🛒':'shopping_cart','🪤':'mousetrap','🪜':'ladder',
    // TOOLS
    '🔧':'wrench','🔨':'hammer','🛠️':'hammer_wrench','⛏️':'pick',
    '⚒️':'hammer_pick','🔩':'nut_bolt','⚙️':'gear','🪓':'axe',
    '🪚':'carpentry_saw','🪛':'screwdriver','🧰':'toolbox','🧲':'magnet',
    '🔗':'link','⛓️':'chains','🪝':'hook','🗜️':'clamp',
    // SECURITY / KEYS
    '🔒':'locked','🔓':'unlocked','🔏':'locked_with_pen',
    '🔐':'locked_with_key','🔑':'key','🗝️':'old_key',
    // MEDICAL
    '💊':'pill','💉':'syringe','🩸':'drop_of_blood',
    '🩹':'adhesive_bandage','🩼':'crutch','🩺':'stethoscope',
    '🩻':'x_ray',
    // MONEY / OFFICE EXTRA
    '💰':'money_bag','🪙':'coin','💳':'credit_card','🧾':'receipt',
    '✉️':'envelope','📧':'email','📨':'incoming_envelope','📩':'envelope_arrow',
    '📤':'outbox_tray','📥':'inbox_tray','📦':'package',
    '📫':'mailbox_raised','📪':'mailbox_lowered','📬':'mailbox_open_raised',
    '📭':'mailbox_open_lowered','📮':'postbox','🗳️':'ballot_box',
    '💼':'briefcase','📁':'file_folder','📂':'open_file_folder',
    '🗂️':'card_dividers','📅':'calendar','📆':'tear_off_calendar',
    '🗒️':'spiral_notepad','🗓️':'spiral_calendar','📇':'card_index',
    '📈':'chart_increasing','📉':'chart_decreasing','📊':'bar_chart',
    '📋':'clipboard','📌':'pushpin','📍':'round_pushpin',
    '📎':'paperclip','🖇️':'linked_paperclips','📏':'straight_ruler',
    '📐':'triangular_ruler','✂️':'scissors','🗃️':'card_file_box',
    '🗄️':'file_cabinet','🗑️':'wastebasket',
    // SCIENCE
    '⚗️':'alembic','🧪':'test_tube','🧫':'petri_dish',
    '🧬':'dna','🔬':'microscope','🔭':'telescope','📡':'satellite_antenna',
    // MUSIC EXTRA
    '🔇':'muted_speaker','🔈':'speaker_low','🔉':'speaker_medium',
    '🔊':'speaker_high','📢':'loudspeaker','📣':'megaphone',
    '📯':'postal_horn','🔔':'bell','🔕':'bell_slash',
    '🎼':'musical_score','🎵':'musical_note','🎶':'multiple_notes',
    '🎙️':'studio_microphone','🎚️':'level_slider','🎛️':'control_knobs',
    '🎤':'microphone','🎧':'headphone','📻':'radio',
    '🪗':'accordion','🥁':'drum','🪘':'long_drum',
    // WRITING EXTRA
    '✏️':'pencil','✒️':'black_nib','🖋️':'fountain_pen',
    '🖊️':'pen','🖌️':'paintbrush','🖍️':'crayon',
    '📝':'memo','📔':'notebook_decorated','📕':'closed_book',
    '📖':'open_book','📗':'green_book','📘':'blue_book',
    '📙':'orange_book','📚':'books','📓':'notebook',
    '📒':'ledger','📃':'page_curl','📜':'scroll',
    '📄':'page_facing_up','📰':'newspaper','🗞️':'rolled_newspaper',
    '📑':'bookmark_tabs','🔖':'bookmark','🏷️':'label','📛':'name_badge',
    // CAMERA / FILM EXTRA
    '🎥':'movie_camera','🎞️':'film_frames','📽️':'film_projector',
    '🎬':'clapper_board','📺':'television','📷':'camera',
    '📸':'camera_flash','📹':'video_camera','📼':'videocassette',
    '🔍':'magnifying_left','🔎':'magnifying_right',
    '🖼️':'framed_picture','🧵':'thread','🪡':'sewing_needle',
    '🧶':'yarn','🪢':'knot','🧮':'abacus',
    // OTHER OBJECTS
    '🚬':'cigarette','⚰️':'coffin','🪦':'gravestone','⚱️':'funeral_urn',
    '🗿':'moai','🪧':'placard','🪪':'id_card',
    '⚜️':'fleur_de_lis','🔱':'trident','🔰':'beginner',
    '♻️':'recycle','☢️':'radioactive','☣️':'biohazard',
    '⚠️':'warning','🚸':'children_crossing','⛔':'no_entry',
    '🚫':'prohibited','🚳':'no_bicycles','🚭':'no_smoking',
    '🚯':'no_littering','🚱':'no_potable_water','🚷':'no_pedestrians',
    '📵':'no_mobile_phones','🔞':'no_underage',
    // ARROWS
    '⬆️':'up_arrow','↗️':'upper_right_arrow','➡️':'right_arrow',
    '↘️':'lower_right_arrow','⬇️':'down_arrow','↙️':'lower_left_arrow',
    '⬅️':'left_arrow','↖️':'upper_left_arrow','↕️':'up_down_arrow',
    '↔️':'left_right_arrow','↩️':'right_curving_left','↪️':'left_curving_right',
    '⤴️':'up_curving','⤵️':'down_curving','🔃':'clockwise_arrows',
    '🔄':'counterclockwise_arrows','🔙':'back','🔚':'end','🔛':'on',
    '🔜':'soon','🔝':'top',
    // MEDIA CONTROLS
    '🔀':'shuffle','🔁':'repeat','🔂':'repeat_single',
    '▶️':'play','⏩':'fast_forward','⏭️':'next_track',
    '⏯️':'play_pause','◀️':'reverse','⏪':'rewind','⏮️':'last_track',
    '🔼':'up_button','⏫':'fast_up','🔽':'down_button','⏬':'fast_down',
    '⏸️':'pause','⏹️':'stop','⏺️':'record','⏏️':'eject',
    // SIGNS
    '🏧':'atm','🚮':'litter_bin','🚰':'potable_water','♿':'wheelchair',
    '🚹':'mens_room','🚺':'womens_room','🚻':'restroom','🚼':'baby_symbol',
    '🚾':'wc','🛂':'passport_control','🛃':'customs',
    '🛄':'baggage_claim','🛅':'left_luggage',
    '🎦':'cinema','🔅':'dim_button','🔆':'bright_button',
    '📶':'signal_strength','📳':'vibration_mode','📴':'phone_off',
    '🛐':'place_of_worship','♾️':'infinity','⚕️':'medical_symbol',
    '💱':'currency_exchange','💲':'dollar_sign','〰️':'wavy_dash',
    // AWARDS
    '🎖️':'military_medal','🏆':'trophy','🏅':'sports_medal',
    '🥇':'first_place','🥈':'second_place','🥉':'third_place',
    '🎗️':'reminder_ribbon','🎟️':'admission_tickets','🎫':'ticket',
    // FLAGS EXTRA
    '🏴‍☠️':'pirate_flag',
    // NEWER EMOJI (Unicode 15-16)
    '🪾':'bare_tree','🪼':'jellyfish','🪽':'wing',
    '🪿':'goose','🪻':'hyacinth_2','🫛':'pea_pod',
    '🫜':'root_vegetable_2','🫩':'face_with_eye_bags'
});

    // ===========================================================
    // PASCAL CASE MAP (γιà hashtag generation — αντικαθιστά emoji_map.json)
    // ===========================================================
    window.EMOJI_PASCAL_MAP = {};
    
    // Build Pascal case map from the mapping above by transforming keys
    Object.keys(window.EMOJI_MAPPING).forEach(function(emoji) {
        var snakeName = window.EMOJI_MAPPING[emoji];
        var pascalCase = snakeName.split('_').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
        window.EMOJI_PASCAL_MAP[emoji] = pascalCase;
    });

    console.log('✅ PascalMap built —', Object.keys(window.EMOJI_PASCAL_MAP).length, 'entries');

    // =========================================
    // CATEGORIES (for UI picker display)
    // =========================================
    window.EMOJI_CATEGORIES = [
    { title: '😊 Smiles & Emotion', emojis: ['😀','😃','😄','😁','😅','😂','🤣','🙂','🙃','🫠','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫢','🫣','🫤','🫥','🤐','🤨','😐','😑','😶','😶‍🌫️','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓','🧐','🫨','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','🫩','🫆'] },
    { title: '👨 People & Body', emojis: ['👶','🧒','👦','👧','🧑','👨','👩','🧓','👴','👵','🧔','👱','👨‍🦰','👨‍🦱','👨‍🦳','👨‍🦲','👩‍🦰','👩‍🦱','👩‍🦳','👩‍🦲','🧑‍🦰','🧑‍🦱','🧑‍🦳','🧑‍🦲','🧑‍⚕️','👨‍⚕️','👩‍⚕️','🧑‍🎓','👨‍🎓','👩‍🎓','🧑‍🏫','👨‍🏫','👩‍🏫','🧑‍⚖️','👨‍⚖️','👩‍⚖️','🧑‍🌾','👨‍🌾','👩‍🌾','🧑‍🍳','👨‍🍳','👩‍🍳','🧑‍🔧','👨‍🔧','👩‍🔧','🧑‍🏭','👨‍🏭','👩‍🏭','🧑‍💼','👨‍💼','👩‍💼','🧑‍🔬','👨‍🔬','👩‍🔬','🧑‍💻','👨‍💻','👩‍💻','🧑‍🎤','👨‍🎤','👩‍🎤','🧑‍🎨','👨‍🎨','👩‍🎨','🧑‍✈️','👨‍✈️','👩‍✈️','🧑‍🚀','👨‍🚀','👩‍🚀','🧑‍🚒','👨‍🚒','👩‍🚒','👮','🕵️','💂','🥷','👷','🫅','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🫃','🫄','🤱','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧖','🧖‍♂️','🧖‍♀️','🧗','🧗‍♂️','🧗‍♀️','🧘','🧘‍♂️','🧘‍♀️','🛀','🛌','🧍','🧍‍♂️','🧍‍♀️','🧎','🧎‍♂️','🧎‍♀️','🚶','🚶‍♂️','🚶‍♀️','🏃','🏃‍♂️','🏃‍♀️','💃','🕺','🕴️','👯','🏌️','🏌️‍♂️','🏌️‍♀️','🏄','🏄‍♂️','🏄‍♀️','🚣','🚣‍♂️','🚣‍♀️','🏊','🏊‍♂️','🏊‍♀️','⛹️','⛹️‍♂️','⛹️‍♀️','🏋️','🏋️‍♂️','🏋️‍♀️','🚴','🚴‍♂️','🚴‍♀️','🚵','🚵‍♂️','🚵‍♀️','🤸','🤸‍♂️','🤸‍♀️','🤼','🤽','🤾','🤹','🤹‍♂️','🤹‍♀️','👫','👬','👭','💑','💏','👪','🗣️','👤','👥','👣','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🫰','🫱','🫲','🫳','🫴','🫵','🫶','🫷','🫸','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','💋','💌'] },
    { title: '🐶 Animals & Nature', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦏','🦛','🐎','🐖','🐏','🐑','🐐','🐪','🐫','🦒','🦘','🐂','🐃','🐄','🦙','🦝','🦡','🦦','🦨','🦥','🐿️','🦔','🐾','🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🐀','🐁','🐉','🐲','🪽','🪿','🪼','🪻','🌵','🎄','🌲','🌳','🌴','🪴','🌱','🌿','☘️','🍀','🎍','🎋','🍃','🍂','🍁','🪹','🪺','🍄','🐚','🪨','🪵','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🪷','🪸','🌞','🌝','🌛','🌜','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','⭐','🌟','✨','⚡','☄️','💥','🔥','🌪️','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','💧','💦','☔','☂️','🌊','🌫️','🌡️','🪐'] },
    { title: '🍔 Food & Drink', emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🥜','🫘','🌰','🫛','🫜','🍞','🥐','🥖','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍼','🥛','☕','🫖','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🫗','🥤','🧃','🧉','🧊','🥢','🍽️','🍴','🥄'] },
    { title: '✈️ Travel & Places', emojis: ['🗺️','🗾','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️','🧱','🛖','🏘️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🕋','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','♨️','🎠','🎡','🎢','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚋','🚌','🚍','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🚚','🚛','🚜','🏎️','🏍️','🛵','🦽','🦼','🛴','🛹','🛼','🚲','🚏','🛣️','🛤️','🛢️','⛽','🚨','🚥','🚦','🛑','🚧','⚓','⛵','🛶','🚤','🛳️','⛴️','🛥️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🛎️','🧳','⌛','⏳','⌚','⏰','⏱️','⏲️','🕰️','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'] },
    { title: '⚽ Activities', emojis: ['⚽','⚾','🥎','🏀','🏐','🏈','🏉','🎾','🥏','🎳','🏏','🏑','🏒','🥍','🏓','🏸','🥊','🥋','🥅','⛳','⛸️','🎣','🤿','🎽','🎿','🛷','🥌','🎯','🪀','🪁','🎱','🔮','🪄','🎮','🕹️','🎰','🎲','🧩','🧸','🪅','🪆','♠️','♥️','♦️','♣️','♟️','🃏','🀄','🎴','🎭','🖼️','🎨','🧵','🪡','🧶','🪢','🎖️','🏆','🏅','🥇','🥈','🥉','🎗️','🎟️','🎫'] },
    { title: '💡 Objects', emojis: ['👓','🕶️','🥽','🥼','🦺','👔','👕','👖','🧣','🧤','🧥','🧦','👗','👘','🥻','🩱','🩲','🩳','👙','👚','👛','👜','👝','🛍️','🎒','🩴','👞','👟','🥾','🥿','👠','👡','🩰','👢','👑','👒','🎩','🎓','🧢','🪖','⛑️','💄','💍','💎','🔇','🔈','🔉','🔊','📢','📣','📯','🔔','🔕','🎼','🎵','🎶','🎙️','🎚️','🎛️','🎤','🎧','📻','🎷','🪗','🎸','🎹','🎺','🎻','🪕','🥁','🪘','📱','📲','☎️','📞','📟','📠','🔋','🪫','🔌','💻','🖥️','🖨️','⌨️','🖱️','🖲️','💽','💾','💿','📀','🧮','🎥','🎞️','📽️','🎬','📺','📷','📸','📹','📼','🔍','🔎','🕯️','💡','🔦','🏮','🪔','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','🪙','💴','💵','💶','💷','💸','💳','🧾','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮','🗳️','✏️','✒️','🖋️','🖊️','🖌️','🖍️','📝','💼','📁','📂','🗂️','📅','📆','🗒️','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔏','🔐','🔑','🗝️','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🔫','🪃','🏹','🛡️','🪚','🔧','🪛','🔩','⚙️','🗜️','⚖️','🦯','🔗','⛓️','🪝','🧰','🧲','🪜','⚗️','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩼','🩺','🩻','🚪','🛗','🪞','🪟','🛏️','🛋️','🪑','🚽','🪠','🚿','🛁','🪒','🪤','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🫧','🪥','🧽','🧯','🛒','🚬','⚰️','🪦','⚱️','🗿','🪧','🪪'] },
    { title: '❤️ Symbols', emojis: ['❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⚛️','🕸️','♻️','⚜️','🔱','📛','🔰','⭕','✅','☑️','✔️','❌','❎','➕','➖','➗','✖️','❓','❔','❕','❗','〰️','💱','💲','⚕️','♾️','♣️','♥️','♦️','♠️','🎴','🀄','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝','🔀','🔁','🔂','▶️','⏩','⏭️','⏯️','◀️','⏪','⏮️','🔼','⏫','🔽','⏬','⏸️','⏹️','⏺️','⏏️','🎦','🔅','🔆','📶','📳','📴','⚠️','🚸','⛔','🚫','🚳','🚭','🚯','🚱','🚷','📵','🔞','☢️','☣️','🏧','🚮','🚰','♿','🚹','🚺','🚻','🚼','🚾','🛂','🛃','🛄','🛅','🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏴‍☠️','🇬🇷','🇮🇹','🇺🇸','🇪🇺','🇫🇷','🇩🇪','🇪🇸','🇨🇳','🇯🇵','🇰🇷','🇧🇷'] }
];

    // =========================================
    // PUBLIC API FUNCTIONS (Backward Compatible)
    // =========================================
    
    /**
     * Converts an emoji character to its CLDR slug (snake_case)
     * Used internally for searching/filtering
     */
    window.emojiToWord = function(emoji) {
        return window.EMOJI_MAPPING[emoji] || '';
    };

    /**
     * Returns the PascalCase version of an emoji's name
     * Used for hashtag generation (#GrinningFace)
     * THIS REPLACES THE OLD emoji_map.json!
     */
    window.emojiToHashtag = function(emoji) {
        return window.EMOJI_PASCAL_MAP[emoji] || '';
    };

    /**
     * Get emoji count in total
     */
    window.getEmojiCount = function() {
        return Object.keys(window.EMOJI_MAPPING).length;
    };

    /**
     * Find emoji by partial name match
     */
    window.findEmojiByName = function(partialName) {
        var results = [];
        var lowerPartial = partialName.toLowerCase();
        
        Object.keys(window.EMOJI_MAPPING).forEach(function(emoji) {
            if (window.EMOJI_MAPPING[emoji].indexOf(lowerPartial) !== -1) {
                results.push({
                    emoji: emoji,
                    name: window.EMOJI_MAPPING[emoji],
                    hashtag: window.EMOJI_PASCAL_MAP[emoji]
                });
            }
        });
        
        return results.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    };

    // =========================================
    // INITIALIZATION LOG  
    // =========================================
    console.log('=====================================');
    console.log('🎨 Lumo Emoji Data Loaded Successfully');
    console.log('=====================================');
    console.log('Total emoji:', window.getEmojiCount());
    console.log('Categories:', window.EMOJI_CATEGORIES.length);
    console.log('Ready for use in admin interface');
    console.log('=====================================');

})();
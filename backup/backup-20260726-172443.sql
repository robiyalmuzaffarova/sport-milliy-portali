--
-- PostgreSQL database dump
--

\restrict yQmKPetsgIiBwTs45zkUBz3VKIy8Sd4UGnqvoXLx3C5JefItQud2tkXjmPP4Piv

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: coursestatus; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.coursestatus AS ENUM (
    'pending',
    'approved',
    'rejected',
    'draft'
);


ALTER TYPE public.coursestatus OWNER TO sportuser;

--
-- Name: educationtype; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.educationtype AS ENUM (
    'academy',
    'federation',
    'school',
    'club'
);


ALTER TYPE public.educationtype OWNER TO sportuser;

--
-- Name: employmenttype; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.employmenttype AS ENUM (
    'full_time',
    'part_time',
    'contract'
);


ALTER TYPE public.employmenttype OWNER TO sportuser;

--
-- Name: jobsporttype; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.jobsporttype AS ENUM (
    'football',
    'kurash',
    'tennis',
    'swimming',
    'fitness',
    'boxing',
    'basketball',
    'volleyball',
    'gymnastics',
    'other'
);


ALTER TYPE public.jobsporttype OWNER TO sportuser;

--
-- Name: newscategory; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.newscategory AS ENUM (
    'ACHIEVEMENTS',
    'COMPETITIONS',
    'NEWS',
    'INTERVIEW',
    'HEALTH',
    'GENERAL'
);


ALTER TYPE public.newscategory OWNER TO sportuser;

--
-- Name: region; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.region AS ENUM (
    'ANDIJAN',
    'BUKHARA',
    'FERGANA',
    'JIZZAKH',
    'KARAKALPAKSTAN',
    'KASHKADARYA',
    'KHOREZM',
    'NAMANGAN',
    'NAVOIY',
    'SAMARKAND',
    'SURKHANDARYA',
    'SYRDARYA',
    'TASHKENT_CITY',
    'TASHKENT_REGION'
);


ALTER TYPE public.region OWNER TO sportuser;

--
-- Name: sporttype; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.sporttype AS ENUM (
    'futbol',
    'kurash',
    'boks',
    'tennis',
    'suzish',
    'gimnastika',
    'atletika',
    'basketbol',
    'voleybol',
    'karate',
    'taekwondo',
    'other'
);


ALTER TYPE public.sporttype OWNER TO sportuser;

--
-- Name: transactionstatus; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.transactionstatus AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public.transactionstatus OWNER TO sportuser;

--
-- Name: transactiontype; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.transactiontype AS ENUM (
    'PURCHASE',
    'DONATION',
    'SUBSCRIPTION'
);


ALTER TYPE public.transactiontype OWNER TO sportuser;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: sportuser
--

CREATE TYPE public.userrole AS ENUM (
    'ADMIN',
    'ATHLETE',
    'TRAINER',
    'OBSERVER'
);


ALTER TYPE public.userrole OWNER TO sportuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_chats; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.ai_chats (
    id integer NOT NULL,
    user_id integer,
    message text NOT NULL,
    response text NOT NULL,
    is_user_message boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ai_chats OWNER TO sportuser;

--
-- Name: ai_chats_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.ai_chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ai_chats_id_seq OWNER TO sportuser;

--
-- Name: ai_chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.ai_chats_id_seq OWNED BY public.ai_chats.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO sportuser;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer,
    merch_id integer,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart OWNER TO sportuser;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_id_seq OWNER TO sportuser;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.courses (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    sport_type public.sporttype NOT NULL,
    video_url character varying(1024) NOT NULL,
    thumbnail_url character varying(1024),
    duration_seconds integer,
    difficulty_level integer NOT NULL,
    qr_code_url character varying(1024),
    qr_code_image_url character varying(1024),
    status public.coursestatus NOT NULL,
    rejection_reason text,
    reviewed_at timestamp with time zone,
    uploaded_by_id integer,
    reviewed_by_id integer,
    view_count integer NOT NULL,
    rating double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO sportuser;

--
-- Name: education; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.education (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    address character varying(500),
    working_hours character varying(100),
    image_url character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    region public.region NOT NULL,
    type public.educationtype,
    phone character varying(20),
    rating double precision DEFAULT '0'::double precision,
    maps_link character varying(500)
);


ALTER TABLE public.education OWNER TO sportuser;

--
-- Name: education_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.education_id_seq OWNER TO sportuser;

--
-- Name: education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.education_id_seq OWNED BY public.education.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer,
    merch_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO sportuser;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.favorites_id_seq OWNER TO sportuser;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: job_vacancies; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.job_vacancies (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    company character varying(255) NOT NULL,
    location character varying(255),
    salary_range character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    contact character varying(255),
    image_url character varying(500),
    region public.region,
    employment_type public.employmenttype,
    sport_type public.jobsporttype
);


ALTER TABLE public.job_vacancies OWNER TO sportuser;

--
-- Name: job_vacancies_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.job_vacancies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_vacancies_id_seq OWNER TO sportuser;

--
-- Name: job_vacancies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.job_vacancies_id_seq OWNED BY public.job_vacancies.id;


--
-- Name: merches; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.merches (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price integer NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    image_url character varying(500),
    is_available boolean DEFAULT true,
    owner_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    brand character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    discount_percent integer DEFAULT 0 NOT NULL,
    is_new boolean DEFAULT false NOT NULL
);


ALTER TABLE public.merches OWNER TO sportuser;

--
-- Name: merches_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.merches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merches_id_seq OWNER TO sportuser;

--
-- Name: merches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.merches_id_seq OWNED BY public.merches.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(500) NOT NULL,
    slug character varying(500) NOT NULL,
    content text NOT NULL,
    snippet text,
    image_url character varying(500),
    views_count integer DEFAULT 0 NOT NULL,
    author_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category public.newscategory DEFAULT 'GENERAL'::public.newscategory NOT NULL
);


ALTER TABLE public.news OWNER TO sportuser;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.news_id_seq OWNER TO sportuser;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    amount integer NOT NULL,
    payment_method character varying(50),
    external_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_type public.transactiontype NOT NULL,
    status public.transactionstatus DEFAULT 'PENDING'::public.transactionstatus
);


ALTER TABLE public.transactions OWNER TO sportuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO sportuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sportuser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone character varying(20),
    avatar_url character varying(500),
    bio text,
    is_active boolean DEFAULT true NOT NULL,
    is_superuser boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    sport_type character varying(100),
    location character varying(255),
    achievements text,
    passport_url character varying(500),
    certificate_url character varying(500),
    is_subscribed boolean DEFAULT false NOT NULL,
    subscription_expires_at character varying(50),
    views_count integer DEFAULT 0 NOT NULL,
    donations_received integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public.userrole DEFAULT 'OBSERVER'::public.userrole NOT NULL,
    rating double precision NOT NULL
);


ALTER TABLE public.users OWNER TO sportuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sportuser
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO sportuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sportuser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ai_chats id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.ai_chats ALTER COLUMN id SET DEFAULT nextval('public.ai_chats_id_seq'::regclass);


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: education id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.education ALTER COLUMN id SET DEFAULT nextval('public.education_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: job_vacancies id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.job_vacancies ALTER COLUMN id SET DEFAULT nextval('public.job_vacancies_id_seq'::regclass);


--
-- Name: merches id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.merches ALTER COLUMN id SET DEFAULT nextval('public.merches_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ai_chats; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.ai_chats (id, user_id, message, response, is_user_message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.alembic_version (version_num) FROM stdin;
208e3bee1c9c
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.cart (id, user_id, merch_id, quantity, created_at, updated_at) FROM stdin;
4	8	10	1	2026-01-15 13:39:45.610186+00	2026-01-15 13:39:45.610186+00
5	8	7	1	2026-01-15 13:39:56.777855+00	2026-01-15 13:39:56.777855+00
7	16	10	1	2026-01-15 17:39:49.384413+00	2026-01-15 17:39:49.384413+00
8	21	10	1	2026-01-15 17:52:16.781716+00	2026-01-15 17:52:16.781716+00
10	18	11	1	2026-01-15 18:03:55.672841+00	2026-01-15 18:03:55.672841+00
11	7	17	1	2026-07-01 12:27:42.746691+00	2026-07-01 12:27:42.746691+00
12	7	11	1	2026-07-01 13:00:55.438968+00	2026-07-01 13:00:55.438968+00
13	7	16	1	2026-07-02 05:44:00.348765+00	2026-07-02 05:44:00.348765+00
14	38	22	1	2026-07-16 15:21:10.806948+00	2026-07-16 15:21:10.806948+00
15	38	19	1	2026-07-16 15:21:14.371104+00	2026-07-16 15:21:14.371104+00
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.courses (id, title, description, sport_type, video_url, thumbnail_url, duration_seconds, difficulty_level, qr_code_url, qr_code_image_url, status, rejection_reason, reviewed_at, uploaded_by_id, reviewed_by_id, view_count, rating, created_at, updated_at) FROM stdin;
adaba2f8-1d03-4faa-9223-eb444113fee1	COMPLETE GUIDE: How To Play Basketball! Basketball Basics For Beginners	How To Play Basketball! Basketball Basics For Beginners\r\n\r\n▶️ FREE hybrid workout develops ball handling & athleticism at the SAME TIME: https://gethandles.com\r\n\r\nIf you want to see more of Jesse "Snake" Muench of Get Handles & Snake Basketball...	basketbol	/uploads/courses/videos/f0dfeb60-a905-456a-b584-4aff76b9de48.mp4	/uploads/courses/thumbnails/be2a7b3b-2b38-42c1-839e-adbdc215645a.jpg	\N	2	http://localhost:3000/courses/adaba2f8-1d03-4faa-9223-eb444113fee1	/uploads/qrcodes/course_adaba2f8-1d03-4faa-9223-eb444113fee1.png	approved	\N	2026-07-16 15:09:28.789448+00	38	7	1	0	2026-07-16 15:03:13.929639+00	2026-07-16 15:10:13.236459+00
ce2b45a1-0db8-495d-80c7-4082f4f545b8	Basic football skills	5	futbol	/media/courses/videos/d1eefb73-1882-4406-be5b-5b177e9d1b87.mp4	/media/courses/thumbnails/4f034e0d-80bb-45d1-a8f5-60ba8f621acb.jpg	\N	1	http://localhost:3000/courses/ce2b45a1-0db8-495d-80c7-4082f4f545b8	/media/qrcodes/course_ce2b45a1-0db8-495d-80c7-4082f4f545b8.png	rejected	video not found	2026-07-09 06:51:43.757644+00	38	7	0	0	2026-07-08 09:22:23.074115+00	2026-07-09 06:51:43.730291+00
63b8bab8-319f-4a1f-92be-1acb33a0e8ec	Why Your Shots ALWAYS Feel so Weak	Want your own game analyzed? Join Football Fundamental Academy and upload a 1 to 2 minute match clip for feedback: https://www.skool.com/football-fundam...\r\n\r\nInside, you’ll get help with first touch, scanning, positioning, decision-making, and playing under pressure and shooting with power.\r\n\r\n⬇️ Get Your Free 21 Day Plan ⬇️\r\nhttps://footballfundamental.kit.com/3...\r\n\r\n✅ Important Links: \r\n\r\n👉 Check Out XbotGo Chameleon to record your games: https://xbotgo.com/es?ref=uhqsimck	futbol	/uploads/courses/videos/2e12dceb-9df5-4a1f-9122-fc11306f0d2a.mp4	/uploads/courses/thumbnails/d318228b-b835-4a18-b89c-db121feae5af.jpg	\N	2	http://localhost:3000/courses/63b8bab8-319f-4a1f-92be-1acb33a0e8ec	/uploads/qrcodes/course_63b8bab8-319f-4a1f-92be-1acb33a0e8ec.png	approved	\N	2026-07-16 15:14:02.636987+00	38	7	0	0	2026-07-16 15:13:19.542592+00	2026-07-16 15:14:02.624748+00
6bd30c8b-1568-4a6e-8ad1-d9d7b1d6ec33	Basic skills for football	5	futbol	/uploads/courses/videos/51c6eb00-ccfe-4c37-bc34-7cc0f54bb3d1.mp4	/uploads/courses/thumbnails/d47aa08a-312a-42b6-b7d7-481046e84e14.jpg	\N	1	http://localhost:3000/courses/6bd30c8b-1568-4a6e-8ad1-d9d7b1d6ec33	/uploads/qrcodes/course_6bd30c8b-1568-4a6e-8ad1-d9d7b1d6ec33.png	approved	\N	2026-07-09 06:56:36.053888+00	38	7	22	0	2026-07-09 06:53:17.836678+00	2026-07-16 17:00:15.389145+00
831eaac6-b98b-4169-a008-5e3511286048	Tennisni 0 dan organish	Tennis	tennis	/uploads/courses/videos/3693096f-1886-4fa9-9d5c-55bdc360ec64.mp4	/uploads/courses/thumbnails/1c3d8102-0365-406f-95a9-8dd91ca4ee19.jpg	\N	2	http://localhost:3000/courses/831eaac6-b98b-4169-a008-5e3511286048	/uploads/qrcodes/course_831eaac6-b98b-4169-a008-5e3511286048.png	pending	\N	\N	38	\N	0	0	2026-07-16 17:04:46.176228+00	2026-07-16 17:04:46.176228+00
cbd3ddb3-823e-48af-afd8-6072a7021ad1	How To Dribble A Basketball For Beginners! Basketball Basics [SECRETS]	Discover secrets for how to INSTANTLY dribble a basketball better for beginners!\r\n\r\nThese are MUST KNOW basketball basics and if you want to get handles in basketball and to make your basketball moves and crossovers work in games.\r\n\r\nUse these ball handling and dribbling tips in your training and drills to improve all your crossover moves!\r\n\r\nYour basic handles will instantly get better and will practice, eventually you can break ankles like Kyrie Irving!\r\n\r\nFREE pro ball handling workout - https://gethandles.com\r\n\r\nIf you want to see more of Jesse "Snake" Muench of Get Handles Basketball & Snake Basketball...	basketbol	/uploads/courses/videos/429ee6a2-50a7-4449-b9db-2ca5d14d024e.mp4	/uploads/courses/thumbnails/28776aed-475a-4cbc-88d6-db8a98fc939e.jpg	\N	2	http://localhost:3000/courses/cbd3ddb3-823e-48af-afd8-6072a7021ad1	/uploads/qrcodes/course_cbd3ddb3-823e-48af-afd8-6072a7021ad1.png	approved	\N	2026-07-16 15:09:29.901051+00	38	7	2	0	2026-07-16 15:07:18.22092+00	2026-07-16 16:01:21.854689+00
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.education (id, name, description, address, working_hours, image_url, created_at, updated_at, region, type, phone, rating, maps_link) FROM stdin;
12	Yengil Atletika Maktabi	Yugurish, sakrash va uloqtirish bo'yicha yosh atletlarni tayyorlovchi mintaqaviy sport maktabi.	Bobur shoh ko'chasi, 5-uy	Dushanba-Shanba, 08:00-19:00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR8NwCx8Ha-tOc47BUeX6lEYSEAra9C7zH71olQqTiZA&s=10	2026-07-10 06:44:51.621479+00	2026-07-16 06:15:21.013383+00	ANDIJAN	school	\N	0	\N
5	Paxtakor Markaziy Stadioni	Paxtakor markaziy stadioni — O‘zbekistonning Toshkent shahrida joylashgan ko‘p maqsadli stadiondir. U O‘zbekistondagi asosiy stadionlardan biri bo‘lib, Toshkent markazidagi Shayxontohur tumanida joylashgan. Stadion 35 000 nafar muxlisni sig‘dira oladi. Bu "Paxtakor" futbol klubining uy arenasidir. Bundan tashqari, O‘zbekiston milliy futbol terma jamoasi ham baʼzi o‘yinlarini ushbu stadionda o‘tkazgan.	Shayxontohur tumani, Islam Karimov ko'chasi, 98A	9.00-18.00	https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Pakhtakor_Markaziy_Stadium.jpg/1280px-Pakhtakor_Markaziy_Stadium.jpg	2026-01-14 19:19:01.64794+00	2026-07-16 06:15:38.198767+00	TASHKENT_CITY	federation	\N	0	\N
3	Tennis Sport Complexi	“Yunusobod” sport majmuasining tennis kortlari\r\n9 ta kort, maxsus sertifikatlangan yuzasi, inventarlari va mashg'ulotlar uchun to`sinlar bilan jihozlangan. Shuningdek, bu erda:\r\n- bolalar uchun tennis maktabi;\r\n- tennis kortlarini ijaraga berish;\r\n- yangi boshlayotganlar uchun mashg'ulotlar;\r\n- murabbiy bilan guruh mashg'ulotlari;\r\n- individual mashg'ulotlar;\r\n- sparring-sherik izlash xizmatlar mavjud. 	Yunusobod tumani, Iftixor ko‘chasi, 1-uy	9.00-18.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSa_nd4orsorL4Thmj_ceMuys4BCe486v34gj5DvRWHw&s	2026-01-08 06:37:22.609632+00	2026-07-16 06:15:44.486514+00	TASHKENT_CITY	club	\N	0	\N
1	Shaxmat Akademiyasi	Respublika ixtisoslashtirilgan shaxmat bo‘yicha bolalar va o‘smirlar sport maktabi	Anhor bo'yi 10 Mustaqillik	9.00-18.00	https://avatars.mds.yandex.net/get-altay/11420721/2a0000018e354d594554ffc1b786ec0bf097/orig	2026-01-08 05:47:17.510821+00	2026-02-09 10:50:22.495342+00	TASHKENT_CITY	\N	\N	0	\N
9	 Toshkent Futbol Akademiyasi	Yosh futbolchilarni professional darajada tayyorlaydigan zamonaviy akademiya, xalqaro standartlarga mos maydonlar bilan jihozlangan.	 Chilonzor tumani, Bunyodkor ko'chasi, 12-uy 	Dushanba-Shanba, 08:00-20:00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rRELsCIte7wqFH-EdTpNolFhCulPPhX9RZQ9h6IKaw&s=10	2026-07-10 06:35:00.699503+00	2026-07-10 06:35:00.699503+00	TASHKENT_CITY	\N	\N	0	\N
2	Suzish Sport Complex	Yunusobod sport majmuasining suv sporti saroyi \r\nO'zbekistondagi Olimpiya standartlariga javob beradigan birinchi suzish havzasi (50x20 va 20x20 metr). Hovuz 500 tomoshabinga mo'ljallangan.	Yunusobod tumani, Iftixor ko‘chasi, 1-uy	9.00-18.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTen4UbZccqJasMUZKb3NrtJNQ9gZ07dlgAyKzooZY3_A&s=10	2026-01-08 06:34:54.455368+00	2026-07-10 06:48:16.066269+00	TASHKENT_CITY	\N	\N	0	\N
11	Boks Markazi	 Havaskor va professional bokschilarni tayyorlovchi, zamonaviy ring va trenajyorlar bilan jihozlangan markaz.	Al-Farg'oniy ko'chasi, 8-uy	Har kuni, 07:00-21:00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR02FJE2zuN3EN_4AcpaJ656D_6VHiu_o-wOChn1WWIoA&s	2026-07-10 06:43:13.236653+00	2026-07-16 06:16:09.057559+00	FERGANA	club	\N	0	\N
10	Gimnastika Sport Saroyi	Badiiy va sport gimnastikasi bo'yicha ixtisoslashgan, tajribali murabbiylar jamoasiga ega ta'lim muassasasi.	 Qarshi, Istiqlol mahallasi	Dushanba-Juma, 09:00-18:00	https://avatars.mds.yandex.net/get-altay/4464784/2a000001792050008a0353f109a9d6956ceb/XXL_height	2026-07-10 06:41:04.308618+00	2026-07-16 06:15:00.967982+00	KASHKADARYA	school	\N	0	\N
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.favorites (id, user_id, merch_id, created_at, updated_at) FROM stdin;
3	8	11	2026-01-15 13:38:33.853331+00	2026-01-15 13:38:33.853331+00
5	8	8	2026-01-15 13:38:56.532276+00	2026-01-15 13:38:56.532276+00
6	16	11	2026-01-15 17:39:04.886434+00	2026-01-15 17:39:04.886434+00
8	18	11	2026-01-15 18:03:19.793176+00	2026-01-15 18:03:19.793176+00
19	7	18	2026-07-02 05:39:21.053156+00	2026-07-02 05:39:21.053156+00
20	7	17	2026-07-02 05:39:22.373043+00	2026-07-02 05:39:22.373043+00
21	7	16	2026-07-02 05:42:27.808633+00	2026-07-02 05:42:27.808633+00
22	38	23	2026-07-16 15:20:56.342803+00	2026-07-16 15:20:56.342803+00
23	38	21	2026-07-16 15:20:58.263277+00	2026-07-16 15:20:58.263277+00
\.


--
-- Data for Name: job_vacancies; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.job_vacancies (id, title, description, company, location, salary_range, is_active, created_at, updated_at, contact, image_url, region, employment_type, sport_type) FROM stdin;
7	Yoshlar Sporti Bo'yicha Koordinator	 Biz Navoiy viloyatidagi mahalliy yoshlar sport dasturlariga rahbarlik qilish uchun ishtiyoqli va uyushqoq Yoshlar Sporti bo'yicha Koordinatorni izlamoqdamiz. Nomzod yoshlarni rivojlantirishga ishtiyoqli bo'lishi va turli sport turlari bo'yicha mustahkam bilimga ega bo'lishi kerak. Vazifalar quyidagilarni o'z ichiga oladi: turli yoshlar jamoalari uchun mashg'ulot va o'yin mavsumlarini rejalashtirish va jadvallashtirish; ko'ngilli murabbiylarni jalb qilish, o'qitish va boshqarish; ota-onalar va vasiylar bilan samarali muloqot qilish; sport jihozlari va inshootlarining texnik xizmati va tayyorligini nazorat qilish; mavsum yakuni tadbirlari va turnirlarini tashkil etish.	Navoiy Sport Majmuasi	Navoiy Sports Center, 123 Dustlik Street, Navoiy	5000000-7000000	t	2026-01-18 11:12:01.371037+00	2026-07-17 05:48:05.563751+00	+998 93 321 78 90	https://img.freepik.com/premium-vector/sport-center-esport-sport-logo-emblem_173356-104.jpg	NAVOIY	full_time	other
3	Basketball Trainer	Vazifalar:\r\n\r\nGuruh va individual mashg‘ulotlar o‘tkazish.\r\n\r\nTo‘p uzatish, dribling va aniq zarba texnikasini o‘rgatish.\r\n\r\nJismoniy chidamlilik va jamoaviy taktikani rivojlantirish.\r\n\r\nTalablar:\r\n\r\nTajriba: Professional basketbol o‘tmishi yoki murabbiylik tajribasi.\r\n\r\nBilim: O‘yin qoidalari va zamonaviy mashg‘ulot metodikalarini bilish.\r\n\r\nSifatlar: Liderlik, yuqori energiya va bolalar bilan til topishish.\r\n\r\nBiz taklif etamiz:\r\n\r\nSifatli sport zali va inventarlar.\r\n\r\nRaqobatbardosh ish haqi.\r\n\r\nO‘sish va rivojlanish imkoniyati.	Yunsobod Sport Complexi	Tashkent Uzbekistan	7000000-9000000	t	2026-01-08 06:49:39.499782+00	2026-07-17 05:47:25.875565+00	+998 93 761 23 10	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7UMLzIV80FTbjIq5k1abMA9MPt0jlzYUUN4vGYjFHvA&s=10	TASHKENT_CITY	contract	basketball
9	Sport Menejeri (Musobaqalar Bo'yicha)	Farg'ona viloyatidagi sport majmuasiga viloyat va respublika miqyosidagi musobaqalarni tashkil etish va boshqarish uchun tajribali sport menejeri talab qilinadi. Vazifalarga musobaqa jadvalini tuzish, hakamlar hay'ati bilan muvofiqlashtirish, sponsorlik aloqalarini yuritish va tadbir logistikasini nazorat qilish kiradi. Tashkilotchilik qobiliyati va sport sohasidagi tajriba muhim.	Farg'ona Sport Majmuasi	Farg'ona shahri	6,000,000 - 9,500,000	t	2026-07-16 12:30:56.994729+00	2026-07-17 05:48:22.416763+00	jobs@ferganasport.uz	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBzNsOtBpVNJaBcUomS7iB062kN87KGzVHdnXPrUhqrw&s=10	FERGANA	part_time	other
6	Bosh Sport Murabbiyi (Skvoch Bo'yicha Mutaxassis)	 Biz Andijon viloyatidagi mahalliy basketbol dasturlarining rivojlanishini nazorat qilish uchun yuqori darajada mativatsiyalangan Sport Murabbiyini izlamoqdamiz. Muvaffaqiyatli nomzod maxsus mashg'ulot rejimlarini ishlab chiqish, kunlik mashg'ulot mashg'ulotlarini o'tkazish va yosh sportchilarning texnik ko'nikmalari hamda jismoniy tayyorgarligini oshirish uchun ularga homiylik qilish bilan shug'ullanadi. Siz asosan mintaqaviy sport inshootlarimizda ishlaysiz, mahalliy jamoat ichida iqtidorlarni rivojlantirishga va jamoalarni viloyat musobaqalariga tayyorlashga e'tibor qaratasiz.\r\n	Andijon Elite Atletika	Andijan Region, Uzbekistan	8000000-11000000	t	2026-01-15 12:43:25.14641+00	2026-07-17 05:47:47.208745+00	Telegram: @andijansports.uz	https://img.freepik.com/premium-vector/squash-club-logo-template-design_630259-582.jpg	ANDIJAN	part_time	other
8	Futbol Murabbiyi (Yoshlar Guruhi)	Toshkent shahridagi yoshlar futbol akademiyasiga 10-14 yosh oralig'idagi bolalar bilan ishlaydigan tajribali murabbiy talab qilinadi. Nomzod texnik va taktik mashg'ulotlarni rejalashtirish, o'quvchilarning jismoniy tayyorgarligini nazorat qilish va ota-onalar bilan muntazam aloqa o'rnatish bilan shug'ullanadi. Litsenziyaga ega bo'lish va kamida 3 yillik ish tajribasi afzallik hisoblanadi.	Toshkent Yoshlar Futbol Akademiyasi	Toshkent shahri	4,500,000 - 7,000,000	t	2026-07-16 12:08:37.60142+00	2026-07-17 05:46:41.925544+00	hr@tfa.uz	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21po8ktiPLsB8LwxW5JMjGp8gwTPz3q0hrqOJubLsSw&s=10	TASHKENT_CITY	contract	football
10	Suzish Bo'yicha Murabbiy	 Buxoro viloyatidagi suzish bazasiga boshlang'ich va o'rta guruh o'quvchilari bilan ishlaydigan murabbiy talab qilinadi. Nomzod suv xavfsizligi qoidalarini yaxshi bilishi, yosh suzuvchilarning texnikasini rivojlantirishi va musobaqalarga tayyorlash jarayonini boshqarishi kerak. Suzish bo'yicha sertifikat va birinchi tibbiy yordam ko'rsatish bo'yicha guvohnoma talab etiladi.	Buxoro Suzish Markazi	Buxoro shahri	4,000,000 - 6,500,000 	t	2026-07-16 12:32:40.965819+00	2026-07-17 05:46:07.166013+00	info@bukharaswim.uz	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7B-LgpEQD9QoxQwIFq_BffCVxnTH6WpHzkYI254mqmw&s=10	BUKHARA	full_time	swimming
2	Tennis Trainer	Vazifalar:\r\n\r\nBoshlang‘ich va professional darajadagi darslarni o‘tish.\r\n\r\nTexnika, zarba va kortdagi taktikani shakllantirish.\r\n\r\nJismoniy tayyorgarlik va turnirlarga tayyorlash.\r\n\r\nTalablar:\r\n\r\nTajriba: Professional tennis tajribasi yoki murabbiylik sertifikati.\r\n\r\nKo‘nikma: Kortdagi yuqori faollik va o‘yin qoidalarini mukammal bilish.\r\n\r\nSifatlar: Kommunikabellik, energiya va intizom.\r\n\r\nBiz taklif etamiz:\r\n\r\nZamonaviy kortlarda ishlash.\r\n\r\nKelishilgan ish haqi (soatbay yoki oylik).\r\n\r\nQulay ish grafigi.	GoTennis	Tashkent Uzbekistan	8000000-10000000	t	2026-01-08 06:47:39.146924+00	2026-07-17 05:46:57.593823+00	+998 93 321 78 90	https://media.istockphoto.com/id/1352616339/vector/vintage-tennis-vector-icon-tennis-club-tournament-championship-on-white-background.jpg?s=612x612&w=0&k=20&c=1GJbOniAaEy__utIoMQQotcFTDU3jcWtmUmr4mieMH8=	TASHKENT_CITY	full_time	tennis
1	Shaxmat Trayneri	Vazifalar:\r\n\r\nGuruh va individual darslar o‘tish.\r\n\r\nDebyut, mitelshtpil va endshtpilni o‘rgatish.\r\n\r\nO‘quvchilar o‘yinini tahlil qilish va turnirlarga tayyorlash.\r\n\r\nTalablar:\r\n\r\nDaraja: Kamida 1-razryad yoki KMU (Kandidat Master).\r\n\r\nKo‘nikma: Chess.com, Lichess va ChessBase dasturlarini bilish.\r\n\r\nSifatlar: Sabr-toqat, bolalar bilan ishlash qobiliyati va mas’uliyat.\r\n\r\nBiz taklif etamiz:\r\n\r\nMoslashuvchan grafik.\r\n\r\nYaxshi ish haqi.\r\n\r\nAhil jamoa.	Shaxmat Akademiyasi	Tashkent Uzbekistan	5000000-7000000	t	2026-01-08 06:45:58.39148+00	2026-07-17 05:47:12.536171+00	+998 90 945 50 55	https://play-lh.googleusercontent.com/a7R5nyeaX8lIEWdBOxjlvbyq9LcFwh3XMvNtBPEKR3LPGgdvgGrec4sJwn8tUaaSkw=s256-rw	TASHKENT_CITY	part_time	other
\.


--
-- Data for Name: merches; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.merches (id, name, description, price, stock, image_url, is_available, owner_id, created_at, updated_at, brand, category, discount_percent, is_new) FROM stdin;
11	Zamonaviy sport sumkasi	string	350000	357	https://images.uzum.uz/d364vpd2lln9aeon3ulg/original.jpg	t	8	2026-01-15 13:35:35.796709+00	2026-01-15 13:35:35.796709+00	Adidas	equipment	0	f
7	Sport kostyumi NIKE	Erkaklar qora yengil kurtka NIKE Jordan Sport Classic oʻlcham 2xl	1603000	300	https://admin.di-sport.uz/storage/thumbnails/galleries/29831/RzG5Pr4r7mkCcbNWX6bHStB52MZDKqB1JCMpUvi3-large.webp	t	7	2026-01-14 19:04:27.646557+00	2026-07-16 11:43:17.985826+00	NIKE	clothing	10	t
8	CHOP II Krossovkalari	Erkaklar krossovkalar ON Running Cloudsurfer Trail WP 1 oʻlcham 43	3501000	120	https://admin.di-sport.uz/storage/thumbnails/galleries/29292/Mhsvrmz8NRgkLqS8KP1hGt786PnkZ9NdK7jCUpyd-large.webp	t	7	2026-01-14 19:06:31.196907+00	2026-07-16 11:44:56.888869+00	ON Running	footwear	0	t
23	Ayollar uchun yengil kurtka PUMA	Ayollar jigarrang yengil kurtka PUMA T7 Balloon Sleeve Pi oʻlcham m	1586000	500	https://admin.di-sport.uz/storage/thumbnails/galleries/27556/8seGABsMYdwL0mkON0zWHgZBLOUVdzZ9iBpwNw3R-large.webp	t	\N	2026-07-16 11:41:22.964615+00	2026-07-16 11:41:22.964615+00	PUMA	clothing	30	t
18	Smart Sport Soat	Yurak urishi va GPS li professional sport soat	2500000	5	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN8Ty-PMSPx-sdnTiywTBes289YkULLaF6TYkGPuMEWg&s=10	t	\N	2026-06-29 09:35:26.254344+00	2026-06-29 09:41:01.729346+00	Garmin	accessories	10	t
10	Erkaklar uchun Adidas Campus krossovkalari	Bu krossovkalar o'ziga xos dizayn va uslubga ega bo'lib, sun'iy charmdan tayyorlangan. Ofis, maktab, qishloq, ish, kundalik sayrlar va hatto velosipedda yoki skuterda yurish uchun qulay krossovkalar. Yumshoq, past kesimli krossovkalar yuqori sifatli materiallardan tayyorlangan bo'lib, ustki qismi sun'iy charm va eko-zamsh bilan qoplangan. Bu yengil krossovkalar erkaklar va ayollar, jumladan, bolalar uchun mos keladi. Kampus o'smir qizlar va o'g'il bolalar, kattalar ayollar va erkaklar uchun ideal bo'lib, 90-yillar uslubidagi Samba shimlari, ko'ylaklari, yubkalari yoki jinsi shimlari bilan birlashtirilgan. Minimalist dizayn kamtarona aksentlar va ranglarni qadrlaydiganlar uchun juda mos keladi. Ularni tozalash oson: shunchaki charm qismlarini mato bilan artib oling va zamsh yuzalarini himoya spreyi bilan ishqalang.	450000	286	https://images.uzum.uz/d5jmdfojsv1q0h27ghj0/original.jpg	t	8	2026-01-15 13:22:54.586054+00	2026-02-17 07:14:04.763861+00	Adidas	footwear	0	f
17	Professional Boks Qo'lqopi	Jahon standarti boks qo'lqopi, 12 oz	850000	15	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnz5ziaX-z87H6mK30VpZ9cTlw0Dvb6KukXbUvzdqvJQ&s=10	t	\N	2026-06-29 09:25:24.152564+00	2026-06-30 08:52:31.552497+00	Adidas Sport	equipment	15	t
16	Ракетка для большого тенниса	Ракетка HEAD Extreme MP создана для игроков, стремящихся к максимальному вращению и мощным ударам. Технология Auxetic 2.0 улучшает стабильность и контакт с мячом, обеспечивая четкость удара. Уникальные люверсы вращения усиливают эффект батута и создают дополнительное вращение. Прозрачные люверсы придают ракетке современный стиль. Отличный выбор для тех, кто хочет доминировать на корте с помощью вращения.\r\n	3499957	500	https://admin.di-sport.uz/storage/thumbnails/galleries/19197/2qBPrHZI65tA5jG21yIQvwvPo2ZDYXa2WHp3u7eh-large.webp	t	\N	2026-02-08 12:57:43.398153+00	2026-06-30 08:52:45.418819+00	HEAD	equipment	12	f
15	REEBOK sport poyabzal	Reebok poyabzali - sport, sayr va kundalik qulaylik uchun universal va zamonaviy model. Yengil, qulay va faol hayot ritmi uchun juda mos.\r\n\r\nQulay o‘tirish va oyoqni ishonchli qo‘llab-quvvatlash\r\n\r\nHar qanday qiyofaga mos keladigan universal dizayn\r\n\r\nMashqlar va kundalik kiyimlar uchun mos\r\n\r\nOyoqqa yoqimli materiallar va sifatli shamollatish\r\n\r\nReebok sport va kundalik kiyimlari bilan a’lo darajada uyg‘unlashadi	1500000	350	https://images.uzum.uz/d4t6cpojsv1o95chlhog/original.jpg	t	\N	2026-01-18 11:14:40.246108+00	2026-06-30 08:53:03.274192+00	Reebok	footwear	20	f
19	Beysbolka CALVIN KLEIN	Kattalar uchun uniseks qora beysbolkalar CALVIN KLEIN 6 panel classic - wicking poly oʻlcham os	697000	360	https://admin.di-sport.uz/storage/thumbnails/galleries/14907/2OIKGGy9WR7hrloCatzpnSxZHE5Iu5M10nNFxqN2-large.webp	t	\N	2026-07-16 11:33:02.993637+00	2026-07-16 11:33:02.993637+00	CALVIN KLEIN	accessories	20	t
20	Futbolka NIKE	Erkaklar qora futbolka NIKE Dri-FIT UV Miler oʻlcham m	800000	600	https://admin.di-sport.uz/storage/thumbnails/galleries/29393/putQ1otnZnPiCKPMRzhs13ZmFPsDI6AIsyMlSRQ3-large.webp	t	\N	2026-07-16 11:35:02.369154+00	2026-07-16 11:35:02.369154+00	NIKE	clothing	15	f
21	Tennis sumkasi WILSON	Kattalar uchun uniseks koʻk tennis sumkasi WILSON 3pk team racket bag 2025 navy	840000	250	https://admin.di-sport.uz/storage/thumbnails/galleries/29092/BAloSpg05GdeGRqtpQ3DSLuFo0zpyJkWTpCRJKk8-large.webp	t	\N	2026-07-16 11:36:40.561805+00	2026-07-16 11:36:40.561805+00	WILSON	equipment	0	t
22	Ayollar uchun shimlar ADIDAS	Ayollar indigo rang shimlar ADIDAS Pinstripe Firebird oʻlcham xs	1610000	450	https://admin.di-sport.uz/storage/thumbnails/galleries/29665/9wRwaWNvMw1SqkZHsv6VcUKKeiYbLTNlH2xp0tuk-large.webp	t	\N	2026-07-16 11:38:42.047718+00	2026-07-16 11:38:42.047718+00	ADIDAS	clothing	0	t
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.news (id, title, slug, content, snippet, image_url, views_count, author_id, created_at, updated_at, category) FROM stdin;
9	Venus Uilyams Tarix Yaratmoqda	venus-williams-makes-history	"Baxtli Grand Slam" nomi bilan mashhur Avstraliya Ochiq chempionati afsonaviy qaytishga guvoh bo'lmoqda — 45 yoshli Venus Uilyams tashkilotchilardan maxsus taklif (wildcard) qabul qildi. Asosiy turnir jadvaliga kiritilishi bilan u Avstraliya Ochiq chempionati yakkalik toifasida qatnashgan eng keksa ayol sportchiga aylandi, bu esa uning WTA turida o'tkazayotgan 30-mavsumini nishonlaydi.\r\nAmerikalik tennischi karerasi davomida jami yettita Grand Slam yakkalik unvonini qo'lga kiritgan bo'lib, ularning ikkitasi aynan Melburn kortlarida qo'lga kiritilgan. 2000-yillar boshida singlisi Serena Uilyams bilan birgalikda jahon tennisida hukmronlik qilgan Venus, yillar davomida jarohatlar va sog'liq bilan bog'liq muammolarga qaramay, sport bilan shug'ullanishni davom ettirmoqda.\r\nTashkilotchilarning ushbu qarori nafaqat Venusning shaxsiy yutug'i, balki uning sport tarixiga qo'shgan ulkan hissasini tan olish sifatida ham baholanmoqda. Yosh tennischilar uchun ilhom manbai bo'lib kelayotgan sportchi, endi Melburnda navbatdagi bosqichni yozishga tayyorlanmoqda. Muxlislar uning bu safar qanday natijaga erishishini katta qiziqish bilan kutmoqda — chunki Venus Uilyams uchun yosh hech qachon to'siq bo'lmagan.	Venus Uilyams Tarix Yaratmoqda	https://dyl347hiwv3ct.cloudfront.net/app/uploads/2024/02/ATP-250s-image-1-.webp	9	8	2026-01-14 19:46:25.241446+00	2026-07-16 10:19:15.109326+00	COMPETITIONS
13	O'zbekiston U23 Osiyo Kubogi Chorak Finalida Xitoydan Penaltida Yutqazdi	football-afc-u23-Aaian-cup	JIDDA, Saudiya Arabistoni — O'zbekiston U23 milliy terma jamoasining Osiyo cho'qqisiga intilishi shanba kuni kechqurun kutilmagan tarzda yakunlandi: jamoa 120 daqiqalik charchoq keltiruvchi 0:0 durrang o'yindan so'ng penalti seriyasida Xitoyga 4:2 hisobida yutqazib, AFC U23 Osiyo Kubogi chorak finalida elandi.\r\nGuruh bosqichida Janubiy Koreya va Livanni mag'lub etib, C guruhida birinchi o'rinni egallagan holda pley-off bosqichiga kuchli fаvorit sifatida kirgan O'zbekiston jamoasi Prens Abdulloh Al-Faysal stadionida Xitoyning intizomli himoyasini yorib o'ta olmadi.\r\nUstunlik, Ammo Natijasiz\r\nO'zbekiston 120 daqiqaning katta qismida o'yin tempini nazorat qilib, to'p egaligi bo'yicha ustunlikka ega bo'ldi va bir nechta gol urish imkoniyatlarini yaratdi. Biroq, aniq zarbalarning yetishmasligi va Xitoy darvozabonining mardonavor o'yini "Oq bo'rilar"ni tun davomida umidsizlikka soldi.\r\nQo'shimcha vaqtdan so'ng ham hisob ochilmagan holda qoldi, bu esa penalti seriyasiga olib keldi. O'zbekiston dastlabki penaltilarni realizatsiya qilgan bo'lsa-da, keyingi to'garaklardagi ikkita muhim xato zarbasi jamoaning taqdirini hal qildi. Xitoy terma jamoasidan Vang Bohao hal qiluvchi penaltini aniq urib, o'z jamoasini yarim finalga — Vetnam bilan uchrashuvga olib chiqdi.\r\nKelajakka Nazar: Jahon Chempionati Orzusi\r\nU23 terma jamoasining chorak finalda elanishi achchiq bo'lsa-da, e'tibor endi katta terma jamoaga qaratilmoqda. Terma jamoa kapitani Eldor Shomurodov yaqinda jamoaning 2026-yilgi FIFA Jahon chempionatidagi tarixiy debyuti haqida ommaviy axborot vositalariga bayonot berdi.\r\n"Bizning maqsadimiz — guruhdan chiqish," dedi Shomurodov ushbu hafta boshida. O'zbekiston K guruhida og'ir vazndagi raqiblar — Portugaliya va Kolumbiya bilan bir guruhga tushgan. "Biz mamlakat sha'nini himoya qilishni va O'zbekiston kuchli jamoa ekanligini isbotlashni xohlaymiz. Agar munosib o'yin ko'rsata olsak, o'zbek futboli dunyo bo'ylab yangi muxlislarni jalb qiladi."	O'zbekiston U23 Osiyo Kubogi Chorak Finalida Xitoydan Penaltida Yutqazdi	https://images.unsplash.com/photo-1626248801379-51a0748a5f96?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGZvb3RiYWxsfGVufDB8fDB8fHww	11	7	2026-01-18 11:07:52.399561+00	2026-07-16 10:19:27.790229+00	COMPETITIONS
7	NHL: MakDeyvidning Tug'ilgan Kuni Munosabati Bilan Yangi Yutuq	nhl-mcdavids-birthday-milestone	NHL'da Konnor MakDeyvid o'zining 29 yoshga to'lgan kunini ajoyib natija bilan nishonladi. "Nashville Predators" jamoasiga qarshi o'yinda ikkita rezultativ pas berib, u o'z ochkoli o'yinlar seriyasini 20 o'yingacha uzaytirdi — bu esa uning karerasidagi bir mavsum davomidagi eng uzun seriyasi hisoblanadi.\r\nUshbu yutuq bilan MakDeyvid "Edmonton Oilers" tarixida 20 o'yinlik ochkoli seriyaga erishgan atigi uchinchi o'yinchi sifatida Ueyn Grettski va Pol Koffi kabi afsonaviy hokkeychilar qatoridan joy oldi. Mutaxassislarning ta'kidlashicha, bunday barqaror natijalar ko'rsatish nafaqat individual mahoratni, balki jismoniy tayyorgarlik va o'yin sharoitida hisob-kitob qilish qobiliyatini ham talab qiladi.\r\nMakDeyviddan unchalik uzoq bo'lmagan yana bir yutuqni Oston Metyus qayd etdi. U "Toronto Maple Leafs" jamoasining butun tarixidagi eng ko'p gol urgan futbolchisi sifatida rekordlar kitobiga o'z ismini muhrladi — Mats Sundinning 420 ta gollik rekordini deyarli 300 o'yin kamroq vaqt ichida yangiladi.\r\nIkkala yutuq ham NHL muxlislari va mutaxassislari orasida katta qiziqish uyg'otdi, chunki bunday rekordlar odatda o'nlab yillar davomida buzilmay qolishi mumkin edi. Mavsumning davomida ikkala yulduz o'yinchidan yana qanday yangi natijalar kutilayotgani muxlislarni intiqlik bilan kuzatishga undamoqda.	Tug'ilgan Kuni Munosabati Bilan Yangi Yutuq	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnZNNWmBi5Kk4ealK3CIwPwbZWQX8gGMGmqw&s	12	7	2026-01-14 18:57:02.827257+00	2026-07-16 10:19:35.468613+00	ACHIEVEMENTS
14	O‘zbekiston Milliy Futbol Terma Jamoasi Jahon Chempionati Saralashida G‘alaba Qozondi	ozbekiston-futbol-jahon-chempionati-galaba	Bugun O‘zbekiston milliy futbol terma jamoasi JCh-2026 saralash bosqichi doirasida safarda Qirg‘iziston terma jamoasiga qarshi maydonga tushib, 2:1 hisobida g‘alaba qozondi.\r\n\r\nO‘yin davomida Eldor Shomurodov va Jaloliddin Masharipov raqib darvozasini ishg‘ol qilib, jamoamizning g‘alabasini ta'minladi. Ushbu g‘alaba terma jamoamizning guruhdagi mavqeini yanada mustahkamladi. Bosh murabbiy o‘yindan so‘ng o‘z fikrlarini bildirib, futbolchilarning ko‘rsatgan irodasini yuqori baholadi.	uzb-chempionati-saralashi	https://static.euronews.com/articles/stories/09/32/41/95/1200x675_cmsv2_1e77959b-0178-5382-a8f2-646410ba25e1-9324195.jpg	13	\N	2026-02-07 05:41:41.216349+00	2026-07-16 10:10:48.900403+00	ACHIEVEMENTS
15	O‘zbekistonlik bokschilar xalqaro turnirda umumjamoa hisobida birinchi bo‘lishdi	ozbekiston-boks-xalqaro-turnir-galaba-2026	Bugun yakuniga yetgan xalqaro turnirda O‘zbekiston boks terma jamoasi a'zolari o‘zlarining mahoratlarini yana bir bor isbotlashdi. Final bosqichida ringga ko‘tarilgan 7 nafar vakilimizdan 5 nafari raqiblarini mag‘lub etib, shohsupaning eng yuqori pog‘onasidan joy olishdi. Ularga kelgusi musobaqalarda omad tilab qolamiz.\r\n\r\nAyniqsa, og‘ir vazn toifasidagi janglar muxlislar e'tirofiga sazovor bo‘ldi. Jamoamizning tajribali bokschilari taktik jihatdan ustunlik qilib, muddatidan oldin g‘alabalarga erishishdi. Murabbiylar shtabi ushbu natijani joriy yilda bo‘lib o‘tadigan Osiyo o‘yinlariga tayyorgarlikning muhim bosqichi ekanini ta'kidlashdi. Umumjamoa hisobida O‘zbekiston vakillari 1-o‘rinni egallab, turnir kubogini qo‘lga kiritishdi.	O‘zbekiston charm qo‘lqop ustalari nufuzli musobaqada 5 ta oltin medalni qo‘lga kiritishdi.	https://www.gazeta.uz/media/img/2025/09/Vog8pb17579100727763_l.webp	27	\N	2026-02-07 05:45:22.91908+00	2026-07-16 10:10:43.471369+00	ACHIEVEMENTS
19	Sportchilar uchun yangi subsidiya dasturi e'lon qilindi	sportchilar-uchun-yangi-subsidiya-dasturi	Dastur doirasida 18 yoshgacha bo'lgan sportchilarga jihozlar va mashg'ulotlar uchun subsidiyalar ajratiladi. Ariza topshirish jarayoni to'liq onlayn tarzda, milliy portal orqali amalga oshiriladi.\r\nLoyiha Yoshlar ishlari agentligi va sport vazirligi hamkorligida ishlab chiqilgan bo'lib, uning asosiy maqsadi moliyaviy imkoniyati cheklangan oilalardan chiqqan iqtidorli bolalarning sport bilan shug'ullanishiga to'siq bo'lmasligini ta'minlashdir. Subsidiya nafaqat sport jihozlari, balki murabbiylar xizmati, musobaqalarga sayohat xarajatlari va tibbiy ko'riklarni ham qisman qoplaydi.\r\nAriza topshirish uchun ota-onalar yoki vasiylar milliy portalda ro'yxatdan o'tib, tegishli hujjatlarni (tug'ilganlik haqidagi guvohnoma, oilaviy daromad haqidagi ma'lumot va murabbiy tavsiyanomasi) yuklashlari kerak bo'ladi. Arizalar sport turi va hudud bo'yicha komissiya tomonidan ko'rib chiqiladi, natijalar 15 ish kuni ichida e'lon qilinadi.\r\nDastur birinchi bosqichda besh mingdan ortiq sportchini qamrab olishi kutilmoqda. Agentlik vakillarining ta'kidlashicha, kelgusi yillarda dastur byudjeti oshirilib, qamrov yanada kengaytiriladi. Bu tashabbus mamlakatimizda ommaviy sportni rivojlantirish va yangi iqtidorlarni kashf etishning uzoq muddatli strategiyasining bir qismi hisoblanadi.	Yosh iqtidorli sportchilarni moliyaviy qo'llab-quvvatlash maqsadida yangi davlat dasturi ishga tushirildi.	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrzdmI7vaELiVsuz9v_FCz07uaX-YoJD7TwwyC-4frgg&s=10	2	\N	2026-07-16 10:05:49.295153+00	2026-07-16 10:10:39.640743+00	GENERAL
20	Yosh bokschilar uchun yangi mashg'ulot markazi ochildi	yosh-bokschilar-yangi-mashgulot-markazi	Yangi markaz 200 dan ortiq yosh sportchiga bir vaqtning o'zida mashg'ulot o'tkazish imkonini beradi. Markazda professional ringlar, trenajyor zali va tibbiy xona mavjud.\r\nIkki qavatli, 1500 kvadrat metrdan ortiq maydonni egallagan majmua xalqaro standartlarga mos ravishda qurilgan. Bino ichida uchta to'liq jihozlangan ring, kuch mashqlari uchun alohida zal, sauna va massaj xonalari, shuningdek sportchilarning jarohatlanishining oldini olish va tiklanish jarayonlarini kuzatib boradigan tibbiy xodimlar guruhi doimiy faoliyat yuritadi.\r\nMarkaz qurilishiga davlat byudjetidan va mahalliy tadbirkorlarning homiyligidan mablag' ajratilgan. Loyiha rahbarining so'zlariga ko'ra, markazda nafaqat mashg'ulotlar, balki viloyat va respublika miqyosidagi musobaqalar ham o'tkazilishi rejalashtirilgan, bu esa yosh bokschilarga o'z mahoratini sinab ko'rish uchun qo'shimcha imkoniyat yaratadi.\r\nViloyat sport boshqarmasi rahbari bu loyihani mintaqada boks sportini rivojlantirishga katta hissa sifatida baholadi va yaqin kelajakda shunga o'xshash markazlarni boshqa tumanlarda ham ochish rejalari borligini ma'lum qildi. Markazga qabul boshlangan bo'lib, istaklilar murabbiylar bilan sinov mashg'ulotidan so'ng guruhlarga taqsimlanadi.	Farg'ona viloyatida zamonaviy jihozlar bilan ta'minlangan boks maktabi o'z eshiklarini ochdi.	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9IeUKde9f4vsqtozvvGHyBJ3L7TnEkvPwAmAWEKUBOg&s=10	2	\N	2026-07-16 10:09:47.075785+00	2026-07-16 10:10:35.793516+00	NEWS
5	AFKON 2025: Mane Tanjada Zarba Berdi	afcon-2025-mane-strikes-in-tangier	Afrika Xalqlari Kubogining Tanjadagi birinchi yarim finali bir necha daqiqa oldin dramatik cho'qqiga yetdi. Sadio Mane 78-daqiqada intizomli himoya qurgan Misr darvozasiga zarba berib, Senegalni 1:0 hisobida ilgarilab ketishga muvaffaq bo'ldi. Muhammad Salah boshchiligidagi "Fir'avnlar" o'yinni tezkor kontrhujumlar orqali burishga harakat qilishsa-da, Senegalning to'xtovsiz bosimi ostida raqib darvozasiga xavf sola olmayapti.\r\nSenegal terma jamoasi mudofaa va hujum o'rtasidagi muvozanatni yaxshi saqlab, o'yinning katta qismida to'p egaligini nazorat qilib kelmoqda. Misr terma jamoasi esa asosan kontrhujumlarga tayanib, o'z darvozasi oldida zich mudofaa liniyasini saqlashga urinmoqda — biroq bu strategiya hozircha Senegalning tashabbuskorligiga bardosh bera olmayapti.\r\nAyni paytda, bugun kechqurun soat 20:00 (GMT) da mezbon Marokash o'sib borayotgan Nigeriya terma jamoasi bilan kuchini sinaydi. Marokashlik Brahim Diazning son mushagi shikastlanishi bo'yicha tibbiy tekshiruvdan o'tayotgani "Atlas Sherlari" uchun qo'shimcha tashvish tug'dirmoqda. Shunga qaramay, mezbon jamoa 50 yildan buyon qo'lga kiritilmagan chempionlik unvonini qo'lga kiritish yo'lidagi eng qiyin sinovlaridan biriga tayyorlanmoqda.\r\nIkkala uchrashuv ham turnirning yarim final bosqichini futbol muxlislari uchun unutilmas tomoshaga aylantirishi kutilmoqda, chunki har ikki tarafda ham g'olib bo'lish uchun mavjud barcha imkoniyatlarni ishga solishga tayyor jamoalar maydonga chiqmoqda.	AFKON 2025: Mane Tanjada Zarba Berdi	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX13Oe0nmprT7Z-HMydSpVE-iyhV_0gx-DcQ&s	18	7	2026-01-14 18:50:06.403819+00	2026-07-16 10:19:07.828404+00	COMPETITIONS
23	Sportchilar Uchun To'g'ri Ovqatlanish: Natijaga Ta'siri Qanday	sportchilar-uchun-togri-ovqatlanish	TOSHKENT — Sport tibbiyoti bo'yicha mutaxassislar sportchining natijasiga faqat mashg'ulotlar emas, balki to'g'ri va muntazam ovqatlanish tizimi ham katta ta'sir ko'rsatishini ta'kidlamoqda. So'nggi tadqiqotlar shuni ko'rsatadiki, professional sportchilarning aksariyati mashg'ulotdan keyingi tiklanish jarayoniga yetarlicha e'tibor bermaydi, bu esa uzoq muddatda charchoq va shikastlanish xavfini oshiradi.\r\nMutaxassislarning fikricha, mashg'ulotdan so'ng birinchi 30-60 daqiqa ichida oqsil va uglevodga boy ovqat iste'mol qilish mushaklarning tiklanishini sezilarli darajada tezlashtiradi. Shuningdek, kuniga yetarli miqdorda suv ichish, ayniqsa issiq iqlim sharoitida mashg'ulot o'tkazadigan sportchilar uchun muhim omil sifatida ta'kidlanmoqda.\r\nSport dietologlari yosh sportchilar va ularning ota-onalariga alohida murojaat qilib, "tezkor" parhezlar yoki internet orqali tarqalayotgan tekshirilmagan ovqatlanish tavsiyalaridan saqlanishni so'rashmoqda. Har bir sportchining ovqatlanish rejasi uning yoshi, sport turi va jismoniy yuklamasidan kelib chiqib, malakali mutaxassis tomonidan individual tarzda tuzilishi lozimligi alohida ta'kidlanmoqda.\r\nMilliy terma jamoalar bilan ishlaydigan dietologlar guruhi yaqinda murabbiylar uchun asosiy ovqatlanish tamoyillari bo'yicha qo'llanma tayyorlashni boshladi. Bu qo'llanma orqali mintaqadagi sport maktablari va akademiyalarida ovqatlanish madaniyatini yaxshilash ko'zda tutilgan.	Sportchilar Uchun To'g'ri Ovqatlanish	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvIpuxaMPN_RdZuXRhAuS3mrN1HAU5tXtfEAIh_G6ccw&s=10	0	\N	2026-07-16 10:33:55.828199+00	2026-07-16 10:33:55.828199+00	HEALTH
22	Sportchilarda Tizza Bo'g'imi Shikastlanishlari: Mutaxassislar Ogohlantiradi	sportchilarda-tizza-bogimi-shikastlanishi	TOSHKENT — So'nggi yillarda yosh sportchilar orasida tizza bo'g'imi shikastlanishlari, xususan oldingi salib bog'lami (ACL) jarohatlari sonining oshishi mutaxassislarni tashvishga solmoqda. Sport tibbiyoti markazi vakillarining ma'lumotlariga ko'ra, bunday jarohatlarning katta qismi noto'g'ri isinish mashqlari va ortiqcha yuklama natijasida yuzaga keladi.\r\nMutaxassislar ta'kidlashicha, ayniqsa o'sish davridagi o'smir sportchilar xavf guruhiga kiradi, chunki ularning suyak va bo'g'im tizimi hali to'liq shakllanmagan bo'ladi. Futbol, basketbol va voleybol kabi to'satdan yo'nalish o'zgartirishni talab qiladigan sport turlarida bu xavf yanada yuqori hisoblanadi.\r\nMutaxassislar quyidagi tavsiyalarni bermoqda: har bir mashg'ulot oldidan kamida 15 daqiqalik dinamik isinish, oyoq mushaklarini mustahkamlashga qaratilgan maxsus mashqlar va musobaqalar orasida yetarlicha dam olish muddatini ta'minlash. Shuningdek, murabbiylarga sportchilarning charchoq darajasini kuzatib borish va ortiqcha yuklamadan saqlanish tavsiya etilmoqda.\r\nSog'liqni saqlash vazirligi vakillarining aytishicha, yaqin kelajakda sport maktablari va akademiyalarida jarohatlarning oldini olish bo'yicha maxsus seminarlar tashkil etilishi rejalashtirilgan. Bu tashabbus murabbiylar va ota-onalarni jarohatlanish belgilarini erta aniqlash va tegishli choralar ko'rishga o'rgatishga qaratilgan.	Mutaxassislar Ogohlantiradi	https://drupal-cdn-hfaeddcdbng5hfbg.a01.azurefd.net/sites/default/files/2025-02/Knee_ligament.jpg	0	\N	2026-07-16 10:32:39.473575+00	2026-07-16 10:32:39.473575+00	HEALTH
21	Suhbat: Milliy Terma Jamoa Hujumchisi Abbosbek Fayzullaev — Jahon Chempionati Arafasida	suhbat-abbosbek-fayzullaev-jahon-chempionati	TOSHKENT — O'zbekiston terma jamoasining yosh va istiqbolli hujumchilaridan biri Abbosbek Fayzullaev bilan jamoaning 2026-yilgi FIFA Jahon chempionatiga tayyorgarligi haqida suhbat tashkil etildi.\r\nSport muxbirlari bilan suhbatida Fayzullaev jamoaning so'nggi saralash bosqichidagi o'yinlarda ko'rsatgan natijalaridan mamnun ekanini bildirdi va bu muvaffaqiyatning ortida uzoq yillik mehnat va murabbiylar jamoasining izchil ishi turganini ta'kidladi. U shuningdek, Jahon chempionatida O'zbekistonning debyuti mamlakat futbol tarixi uchun tarixiy voqea ekanini, shu sababli har bir o'yinchi maydonda maksimal darajada masuliyat bilan harakat qilishi zarurligini qayd etdi.\r\nGuruh bosqichida Portugaliya, Kolumbiya va DR Kongo kabi kuchli raqiblar bilan uchrashish oldida hujumchi jamoaning bu qarshilashuvlarga alohida jiddiylik bilan tayyorlanayotganini, ammo bosim emas, balki ilhom sifatida qabul qilinayotganini aytdi. Uning so'zlariga ko'ra, jamoa ichida raqiblarni har tomonlama tahlil qilish ishlari olib borilmoqda va har bir o'yinchi o'z vazifasini aniq tushunib olishga harakat qilmoqda.\r\nSuhbat davomida Fayzullaev yosh futbolchilarga ham murojaat qilib, izchillik va intizomning muvaffaqiyat garovi ekanini ta'kidladi hamda O'zbekiston futbolining kelajagi haqida optimistik fikr bildirdi.	Jahon Chempionati Arafasida	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR4Od-wXbyJTSlNqSGKtweqoNzlCap5xVIpA30FD9kWg&s=10	1	\N	2026-07-16 10:30:42.96633+00	2026-07-18 06:45:46.691422+00	INTERVIEW
24	Eldor Shomurodov Jahon Chempionatidan So'ng: "Psixologik Omil Hal Qiluvchi Bo'ldi"	eldor-shomurodov-jahon-chempionati-suhbat	Bosh murabbiy Fabio Kannavaroning jamoada tajriba yetishmasligi, xususan ikkinchi taymda kutilmaganda uzun passlarga o'tilgani haqidagi fikriga munosabat bildirar ekan, Shomurodov bu holatni tasdiqladi va buning asosiy sababi psixologik omil ekanini ta'kidladi. Uning so'zlariga ko'ra, jamoa hisobda ilgarilab ketganida gol yeb qo'ymaslikka va ustunlikni saqlab qolishga intilish paytida aynan shu xatolar yuz bera boshlaydi — bu esa to'pni yaxshi nazorat qila olmaslikka va raqibning ustunlikdan foydalanishiga olib kelgan.\r\nShomurodov shuningdek, Portugaliyaga qarshi o'yindan so'ng hech kim bilan formalarni almashmagani haqida ham gapirib, o'sha lahzada bunday kayfiyatda bo'lmaganini aytdi. Jahon chempionatida gol urganligi haqida so'ralganda, bunday lahzalar umrbod xotirada qolishini, agar jamoa g'alaba qozonganida bu yanada yaxshiroq bo'lishi mumkinligini bildirdi.\r\nMurabbiy Kannavaro bilan ishlash tajribasi haqida so'ralganda, terma jamoa kapitani buni professional nuqtai nazardan juda foydali bo'lganini, ammo uning barcha g'oyalarini to'liq o'zlashtirish uchun vaqt yetarli bo'lmaganini ta'kidladi. Suhbat yakunida Shomurodov Rossiyadagi karerasi davomida uni qo'llab-quvvatlagan barcha muxlislarga minnatdorchilik bildirdi.\r\nBundan oldin, terma jamoa vatanga qaytgach uyushtirilgan tantanali uchrashuv marosimida Shomurodov jamoaning kutilgan natijaga erisha olmagani uchun muxlislardan uzr so'ragan va shunga qaramay, Jahon chempionatidagi ishtirok O'zbekiston futboli uchun katta yutuq bo'lganini, bu orqali millat futbol atrofida birlashganini ta'kidlagan edi.	Psixologik Omil Hal Qiluvchi Bo'ldi	https://zamin.uz/uploads/posts/2025-11/8b84d30283_235235123512-6.webp	3	\N	2026-07-16 10:38:52.888479+00	2026-07-26 10:43:41.731633+00	INTERVIEW
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.transactions (id, user_id, amount, payment_method, external_id, created_at, updated_at, transaction_type, status) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sportuser
--

COPY public.users (id, email, hashed_password, full_name, phone, avatar_url, bio, is_active, is_superuser, is_verified, sport_type, location, achievements, passport_url, certificate_url, is_subscribed, subscription_expires_at, views_count, donations_received, created_at, updated_at, role, rating) FROM stdin;
8	maftuna@sportmilliyportali.uz	$2b$12$rWX3zMaHKxii1J1VNRZSDeh/0Vhov/vHPAbKOWPKIvD4epUlTOgHO	Maftuna	+998908632807	\N	\N	t	f	t	\N	Tashkent Uzbekistan	\N	\N	\N	f	\N	0	0	2026-01-09 15:38:12.222875+00	2026-01-10 04:32:10.516175+00	ADMIN	4.2
7	robiyamuzaffarova03@gmail.com	$2b$12$ZWdXR6CQ8wm53rSgwkc5YOI/tk.joOELjl272ycIHmHdcZj6PJusG	Robiya	\N	\N	\N	t	t	t	\N	\N	\N	\N	\N	f	\N	0	0	2026-01-09 09:08:27.661978+00	2026-06-16 00:39:03.614943+00	ADMIN	4.5
21	alixan@example.com	$2b$12$CtN1E3dAM6lIVPJwFzuz1utTJ9u/yJcEKbz10Ey05IjIMkzHofVSi	Alixan Raxmetov	+998 01 234 56 78	\N	empty	t	f	f	tennis	tashkent city	\N	\N	\N	f	\N	0	0	2026-01-15 17:44:28.61741+00	2026-01-15 17:44:28.61741+00	OBSERVER	4.5
25	hasanboy@dusmatov.uz	$2b$12$SeLYDkrTrvd7Gpu0LV7.H.zz2alLe4PomZMNmkLlhmX5BqQGtCEKm	Hasanboy Do'smatov	+998997776655	https://cdn.beta.qalampir.uz/uploads/Yl/f_672fJH8n8kGKOMIu3MZOYwk0Tz34QR.jpg	'Professor' laqabi bilan tanilgan, texnikasi eng kuchli bokschilardan biri. Val Barker kubogi sohibi va ikki karra Olimpiada chempioni.	t	f	t	Box	Andijon O'zbekiston	Rio-2016 va Parij-2024 Olimpiadasi Oltin medallari, Jahon chempioni (2023), 3 karra Osiyo chempioni.	\N	\N	f	\N	0	0	2026-02-09 19:31:11.788592+00	2026-02-09 19:34:57.653322+00	ATHLETE	4.5
16	tulkin@kilichev.uz	$2b$12$nCaF6Hoj7Ywi7WhFPdTGaOY/fpVMk6rszuqRHuI6RUMRmTfxwbsrq	To'lqin Qilichev	+998901112233	https://storage.kun.uz/source/10/SDIFaFNE9Z-okJnSwtByADhXElrUHDRf.jpg	O‘zbekiston boks milliy terma jamoasi bosh murabbiyi. Osiyoning eng yaxshi murabbiyi deb e'tirof etilgan. Uning qo‘l ostida o‘zbek bokschilari Olimpiada va Jahon chempionatlarida umumjamoa hisobida birinchi o‘rinni egallab kelmoqda.	t	f	t	Box	Toshkent O'zbekiston	Parij-2024 (5 ta oltin) va Tokio-2020 Olimpiadalari g‘olibi. Bahodir Jalolov va Hasanboy Do‘smatov kabi chempionlarning ustozi.	\N	\N	f	\N	0	0	2026-01-14 16:17:03.957937+00	2026-02-10 06:26:22.231708+00	TRAINER	4.5
26	temur@kapadze.uz	$2b$12$sWU5DOz6hrjq9b7lV7p2q.iidnmbKtm6gq6BDbnqAKSM0ouUqRxHS	Temur Kapadze	+998973334455	https://yuz.uz/imageproxy/1280x/https://yuz.uz/file/news/a62c88229deaaafadba930cea7310505.jpg	O‘zbekiston U-23 Olimpiya terma jamoasi sobiq bosh murabbiyi va "Navbahor" klubi ustozi. O‘zbek futboli tarixida ilk bor terma jamoani Olimpiada o‘yinlariga olib chiqqan tajribali mutaxassis.	t	f	t	Football	Toshkent O'zbekiston	Parij-2024 Olimpiadasi yo‘llanmasi, U-23 Osiyo Kubogi-2022 va 2024 kumush medallari sohibi.	\N	\N	f	\N	0	0	2026-02-10 06:27:34+00	2026-02-10 06:29:38+00	TRAINER	4.5
20	diyora@keldiyorova.uz	$2b$12$If7cKyxFD3Qoh5vfaghdF.lZyLTDRuBsFTSngZ6tj8jMELoSdRPx2	Diyora Keldiyorova	+998939998877	https://cdn.uza.uz/2025/06/18/17/09/vpVo2qVg5xuPLXT3HzSF55yp1MRRi29i_front.jpg	O‘zbekiston tarixidagi yozgi Olimpiada o‘yinlarida oltin medal yutgan birinchi ayol sportchi. Dzyudo olamidagi eng kuchli atletlardan biri.	t	f	t	Dzyudo	Samarqand O'zbekiston	Parij-2024 Olimpiadasi Oltin medali, 2 karra Jahon chempionati kumush medali, Osiyo o‘yinlari g‘olibi.	\N	\N	f	\N	0	0	2026-01-14 17:40:11+00	2026-02-09 19:43:07+00	ATHLETE	4.5
18	abbosbek@fayzullaev.uz	$2b$12$JqsRb.q31Pbw.iIjjxfpT.vZV2A9SNx/Hgi2j4TgcQPth/EcEuw5e	Abbosbek Fayzullayev	+998885554433	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1IDjO6lUqomFLcJbS2Y8X61yS0000hMg0Vh_k-9PuaqHmkYMB3j8leWDS&s=10	O‘zbekiston milliy terma jamoasining eng iqtidorli yosh yulduzi. O‘yinni ko‘ra olish qobiliyati va kreativligi bilan ajralib turadi.	t	f	t	Football	Toshkent O'zbekiston	O‘zbekistonning eng yaxshi futbolchisi (2023), U-20 Osiyo chempioni va MVP, Osiyo Kubogi-2023 ramziy terma jamoasi a'zosi.	\N	\N	f	\N	0	0	2026-01-14 17:36:36+00	2026-02-09 19:39:26+00	ATHLETE	4.5
23	bahodir@jalolov.uz	$2b$12$M4ppCeN5ZEiTvu2C95yC9OIudyStQ7GmNPdF.gy6tlWTlHfzTjmcC	Bahodir Jalolov	+998901234567	https://storage.kun.uz/source/7/sHfICTiYlkSmfMFPWWB4nvAJGLnGCaRd.jpg	Ikki karra Olimpiada chempioni va ikki karra Jahon chempioni. Professional boksda mag'lubiyatsiz odimlayotgan 'Big Uzbek' laqabli afsonaviy sportchi.	t	f	t	Box	Surxondaryo O'zbekiston	Tokio-2020 va Parij-2024 Oltin medallari, Jahon chempioni (2019, 2023), Osiyo chempioni.	\N	\N	f	\N	0	0	2026-02-09 19:14:43+00	2026-02-09 19:20:48+00	ATHLETE	3.8
27	rahmatjon.ruzioxunov@example.uz	$2b$12$028l1Twe/rClqXLPBqELpOmQTxDoqOHejKj8anIIpEil8I2o4LWmG	Rahmatjon Ro'zioxunov	+998935556677	https://static.xabar.uz/crop/3/4/720_460_95_3485728449.jpg	O‘zbekiston boks terma jamoasi katta murabbiyi. "O‘zbekiston Respublikasida xizmat ko‘rsatgan sport ustozi". Professional va havaskor boksda ko‘plab yulduzlarni tarbiyalagan.	t	f	t	Box	Toshkent O'zbekiston	Isroil Madrimov, Murodjon Axmadaliyev va Lazizbek Mullojonov kabi Olimpiada va Jahon chempionlarini tayyorlagan.	\N	\N	f	\N	0	0	2026-02-10 06:30:24+00	2026-02-10 06:32:23+00	TRAINER	4.5
15	maftuna@admin.com	$2b$12$rWX3zMaHKxii1J1VNRZSDeh/0Vhov/vHPAbKOWPKIvD4epUlTOgHO	Maftuna Saidova	+998 903358035	https://www.istockphoto.com/photos/china-girl	\N	t	f	t	\N	Tashkent Uzbekistan	\N	\N	\N	f	\N	0	0	2026-01-10 06:52:09.400745+00	2026-01-10 06:52:35.585021+00	ADMIN	4.7
28	marko.spittka@example.uz	$2b$12$/ISuhh5EqnPc3.roggmNTOPDxXHqNgSKS0C2e79NHeqx78pQmIfQG	Marko Spittka	+998998889900	https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Marko_Spittka.jpg/250px-Marko_Spittka.jpg	O‘zbekiston dzyudo terma jamoasi bosh murabbiyi va texnik direktori. Germaniyalik mutaxassis, o‘zbek dzyudosini yangi bosqichga olib chiqqan murabbiy.	t	f	t	Dzyudo	Toshkent	Shogirdi Diyora Keldiyorova Parij-2024 Olimpiadasida oltin medalni qo‘lga kiritdi. Muzaffarbek Turoboyev (Jahon chempioni) ustozi.	\N	\N	f	\N	0	0	2026-02-10 06:33:39+00	2026-02-10 06:35:18+00	TRAINER	4.5
29	pavel@khan.uz	$2b$12$9L9thjZuVOIGKHQ4Oa/7qeSSYFAp4GrWxAz585VVgw5RTQezIjaGS	Pavel Xan	+998907778899	https://www.olympic.uz/storage/uploads/news/e1a048f35315d085c91069d67c6a9ed8.jpeg	O‘zbekiston Taekvondo WT milliy terma jamoasi bosh murabbiyi. Uning rahbarligida O‘zbekiston taekvondochilari dunyoda yetakchi o‘rinlarga chiqdi.	t	f	t	Taekvondo WT	Toshkent O'zbekiston	Shogirdi Ulug‘bek Rashitov ikki karra (Tokio-2020 va Parij-2024) Olimpiada chempioni bo‘ldi. Jamoaviy Jahon chempionati sovrindori.	\N	\N	f	\N	0	0	2026-02-10 06:37:04+00	2026-02-10 06:38:49+00	TRAINER	4.5
30	ravshan@haydarov.uz	$2b$12$EtaGuCQedhS.yMyDfwBW2.3R8ebJl.KoCXU5PrqvIXMDn5U8v8h4W	Ravshan Haydarov	+998941230987	https://championat.asia/upload/storage/835399_original.jpg	O‘zbekiston yoshlar terma jamoalari (U-20, U-23) bilan ishlash bo‘yicha eng tajribali mutaxassis. "O‘zbekistonda xizmat ko‘rsatgan murabbiy".	t	f	t	Football	Toshkent O'zbekiston	2018-yilgi U-23 Osiyo chempioni, 2023-yilgi U-20 Osiyo chempioni (O‘zbekiston tarixidagi eng yirik yoshlar yutuqlari).	\N	\N	f	\N	0	0	2026-02-10 06:39:35+00	2026-02-10 06:41:37+00	TRAINER	4.5
17	emmawhatson@gmail.com	$2b$12$SIQe.Nu9l0.zt3E2e7Ecxe/JaabzMvSIrDt5diQQ821pQZS17PU7y	Emma Whatson	+998 01 234 56 78	\N	Interested in Tennis	t	f	f	tennis	London UK	\N	\N	\N	f	\N	0	0	2026-01-14 16:36:30.252568+00	2026-01-14 16:36:30.252568+00	OBSERVER	3.5
24	ulugbek@rashitov.uz	$2b$12$O8mVRvM3L91OLvv7lZ9X3uJO7lWqwjjvlbc9w0wN1Ac/.AsJ58tZy	Ulug'bek Rashitov	+998971112233	https://upload.wikimedia.org/wikipedia/commons/0/06/Ulugbek_Rashitov_at_the_2024_Summer_Olympics_03.jpg	O‘zbekiston tarixidagi birinchi ikki karra Olimpiada chempioni bo‘lgan taekvondochi. O‘z vazn toifasida dunyoning mutlaq yetakchisi.	t	f	t	Taekvondo WT	Toshkent O'zbekiston	Tokio-2020 va Parij-2024 Olimpiadasi Oltin medallari, Osiyo o‘yinlari chempioni, Gran-pri g‘olibi.	\N	\N	f	\N	0	0	2026-02-09 19:25:59.936034+00	2026-02-09 19:27:57.141241+00	ATHLETE	4.9
32	laylokarimova04@gmail.com	$2b$12$VUDwSmOMtl2XsNMXg3jIR.hLT7EMp/m0NpzIN8iot.p4.HQ4G8c3q	Laylo Karimova	\N	\N	\N	t	f	f	\N	\N	\N	\N	\N	f	\N	0	0	2026-02-23 06:16:25.300083+00	2026-02-23 06:16:25.300083+00	OBSERVER	4.5
33	robiyamuzaffarova@gmail.com	$2b$12$VtB5wIOeAqTpCtUhBbHWJeWF3Wmi2TfS53RLEY2QrMrfVW7ust2uq	Robiyaxon Muzaffarova	\N	\N	\N	t	f	f	\N	\N	\N	\N	\N	f	\N	0	0	2026-02-23 07:03:33.053923+00	2026-02-23 07:03:33.053923+00	OBSERVER	4.5
34	akbarov@gmail.com	$2b$12$ZPXLudwgQdlFT0YCXx1I5ehblplBw5bX1XXKBq1XYXyHXnbRfaCZy	Aziz Akbarov	\N	\N	\N	t	f	f	\N	\N	\N	\N	\N	f	\N	0	0	2026-02-23 10:09:38.449457+00	2026-02-23 10:09:38.449457+00	OBSERVER	4.5
40	oksana@gmail.com	$2b$12$ta6r7L0NHTR8UrBx.owjAeGn5ZyA6l.6UXcdhsJtarcVlUv8LsBK6	Oksana Chusovitina	+998901234567	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2A9gGvhQ4wdcDdOycOTLy96CVG2vktV-0j4hLfagjoA&s=10	Sport olamida matonat va uzoq yillik faoliyat timsoliga aylangan tirik afsona. Chusovitina 8 ta yozgi Olimpiya oʻyinlarida qatnashgan dunyodagi yagona gimnastikachidir. Faoliyati davomida Sobiq Ittifoq, Germaniya va oʻzining jonajon vatani — mustaqil Oʻzbekiston sharafini himoya qilgan. Xalqaro gimnastika shon-sharaf zaliga kiritilgan. Hozirda ham yosh sportchilarga oʻrnak boʻlib, yirik musobaqalarda faol ishtirok etishda davom etmoqda.	t	f	t	gymnastics	Buxoro O'zbekiston	\N	\N	\N	f	\N	0	0	2026-07-18 05:17:46+00	2026-07-18 05:17:46+00	TRAINER	4.5
38	test@trainer.com	$2b$12$y.x0.OM3k/Dk7ZONFFw.8Oa4BySqrPLm8eiCs0rvNTwLShCMAh3Uu	Rustam Qosimjonov	+998909492160	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRguqzAWbbKF_MRtOVvchmMg2M-7Bdzt7CAbjchrGNRw&s=10	Rustam Qosimjonov shaxmat sir-asrorlarini besh yoshidan boshlab oʻrganishni boshlagan. U yoshlik chogʻidanoq oʻzining yuqori intellektual salohiyati bilan ajralib turgan va tez orada yirik muvaffaqiyatlarga erisha boshlagan: 1994-yilda yoshlar oʻrtasida, 1998-yilda esa kattalar oʻrtasida birinchi marta Osiyo chempionligini qoʻlga kiritgan. 1997-yilda, 18 yoshida grossmeysterlik unvoniga loyiq koʻrilgan.	t	f	t	Shaxmat	tashkent	\N	\N	\N	f	\N	0	0	2026-07-07 11:24:46+00	2026-07-07 11:24:46+00	TRAINER	4.5
42	ilias@gmail.com	$2b$12$lBDCCruf5xuXxFbWzMkaVOqAvtDKZY/2yQ9VY5bgd6qSTFf9p8T2u	Ilias Iliadis	+998901234567	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLRDhpfCr_28OfA_JfOUJZDT3fBm3kAl1wSWrbTPMzMw&s=10	Jahon dzyudo olamining eng yorqin namoyandalaridan biri, Afina-2004 oʻyinlarining eng yosh Olimpiya chempioni va uch karra Jahon chempioni. Dzyudo boʻyicha Oʻzbekiston milliy terma jamoasi bosh murabbiyi etib tayinlangach, jamoaga Yevropa maktabining jismoniy tayyorgarlik uslubini va gʻoliblik psixologiyasini olib kirdi. Bu esa dzyudochilarimizning xalqaro turnirlar va yirik musobaqalarda medallar sonini keskin oshirishiga sabab boʻldi.	t	f	t	Dzyudo	Axmeta, Gruziya	\N	\N	\N	f	\N	0	0	2026-07-18 05:28:56+00	2026-07-18 05:28:56+00	TRAINER	4.5
41	aleksandr@gmail.com	$2b$12$SKmCqeb3nU5ijgo3p56Am.HG41jACkSSoeWOWEH7uPd8tE75PMrVq	Aleksandr Ponomaryov	+998901234567	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkrNHPVG5CbqiLr9nE7-0JxEqn6RHg1lamG8LeE1PlcA&s	O'zbekistonda suv sporti turlarini rivojlantirishga 40 yildan ortiq umrini bag'ishlagan fidoyi murabbiy. Sobiq Ittifoq davridagi muvaffaqiyatli faoliyatidan so'ng, mustaqil O'zbekiston eshkak eshish maktabiga asos soldi. U 20 dan ortiq Xalqaro toifadagi sport ustalarini tarbiyalagan. Uning eng mashhur shogirdi — ko'p karra Jahon chempioni Vadim Menkovdir. Ko'rsatgan ulkan xizmatlari uchun unga "O'zbekiston Respublikasida xizmat ko'rsatgan sport ustozi" unvoni berilgan.	t	f	t	Kanoeda eshkak eshish	Toshkent	\N	\N	\N	f	\N	0	0	2026-07-18 05:25:39+00	2026-07-18 05:25:39+00	TRAINER	4.5
43	eldor@shomurodov.com	$2b$12$1zdhWHg02pLp/PNlopqt/.t8gZXGcUU90JG4wZUMUctf5PA7NAZz2	Eldor Shomurodov	+998901234567	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWBOfFFe2GKIwxNZG0F52IDptSC7l0W4_F_ce91VB1LUpQg_Eq2J3yTTE&s=10	O'zbekiston milliy terma jamoasi sardori va mamlakat tarixidagi eng muvaffaqiyatli futbolchilardan biri. Professional faoliyatini Muborakning "Mash'al" va Toshkentning "Bunyodkor" klublarida boshlagan. Keyinchalik Rossiyaning "Rostov" klubidagi sermahsul o'yinlaridan so'ng Yevropaning kuchli beshlik chempionatlariga yo'l oldi. Italiyaning A Seriyasida "Jenoa", "Speziya", "Kalyari" va Joze Mourinyo boshchiligidagi "Roma" klublarida to'p surdi. "Roma" tarkibida UEFA Konferensiyalar Ligasi chempionligini qo'lga kiritib, nufuzli yevrokubokda g'olib chiqqan ilk o'zbek futbolchisiga aylandi. Turkiyaga ko'chib o'tgach, "İstanbul Başakşehir" safida ham muvaffaqiyatli mavsum o'tkazdi. Terma jamoa safida 45 ta gol urib, O'zbekiston milliy terma jamoasi tarixidagi barcha davrlarning eng yaxshi to'pchisi unvonini saqlab kelmoqda. Shuningdek, u sardor sifatida O'zbekiston termasini o'z tarixida ilk bor Jahon Chempionatiga olib chiqishda bosh rolni ijro etdi.	t	f	t	Football	Surxondaryo	\N	\N	\N	f	\N	0	0	2026-07-18 05:36:09+00	2026-07-18 05:36:09+00	ATHLETE	4.5
45	akmal@gmail.com	$2b$12$4hM8ENhE6XKfh4jYO1wXhu8PkxMbNWa5olWfl0By3jKQiaYkRjKu2	Akmal	\N	\N	\N	t	f	f	\N	\N	\N	\N	\N	f	\N	0	0	2026-07-24 19:57:16.771216+00	2026-07-24 19:57:16.771216+00	TRAINER	4.5
\.


--
-- Name: ai_chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.ai_chats_id_seq', 2, true);


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.cart_id_seq', 15, true);


--
-- Name: education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.education_id_seq', 12, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.favorites_id_seq', 23, true);


--
-- Name: job_vacancies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.job_vacancies_id_seq', 10, true);


--
-- Name: merches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.merches_id_seq', 23, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.news_id_seq', 24, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sportuser
--

SELECT pg_catalog.setval('public.users_id_seq', 45, true);


--
-- Name: ai_chats ai_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.ai_chats
    ADD CONSTRAINT ai_chats_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: job_vacancies job_vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.job_vacancies
    ADD CONSTRAINT job_vacancies_pkey PRIMARY KEY (id);


--
-- Name: merches merches_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.merches
    ADD CONSTRAINT merches_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_ai_chats_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_ai_chats_id ON public.ai_chats USING btree (id);


--
-- Name: ix_cart_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_cart_id ON public.cart USING btree (id);


--
-- Name: ix_courses_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_courses_id ON public.courses USING btree (id);


--
-- Name: ix_courses_sport_type; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_courses_sport_type ON public.courses USING btree (sport_type);


--
-- Name: ix_courses_status; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_courses_status ON public.courses USING btree (status);


--
-- Name: ix_courses_uploaded_by_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_courses_uploaded_by_id ON public.courses USING btree (uploaded_by_id);


--
-- Name: ix_education_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_education_id ON public.education USING btree (id);


--
-- Name: ix_favorites_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_favorites_id ON public.favorites USING btree (id);


--
-- Name: ix_job_vacancies_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_job_vacancies_id ON public.job_vacancies USING btree (id);


--
-- Name: ix_merches_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_merches_id ON public.merches USING btree (id);


--
-- Name: ix_news_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_news_id ON public.news USING btree (id);


--
-- Name: ix_news_slug; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE UNIQUE INDEX ix_news_slug ON public.news USING btree (slug);


--
-- Name: ix_news_title; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_news_title ON public.news USING btree (title);


--
-- Name: ix_transactions_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_transactions_id ON public.transactions USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: sportuser
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ai_chats ai_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.ai_chats
    ADD CONSTRAINT ai_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart cart_merch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_merch_id_fkey FOREIGN KEY (merch_id) REFERENCES public.merches(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_reviewed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: courses courses_uploaded_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_uploaded_by_id_fkey FOREIGN KEY (uploaded_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: favorites favorites_merch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_merch_id_fkey FOREIGN KEY (merch_id) REFERENCES public.merches(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: merches merches_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.merches
    ADD CONSTRAINT merches_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: news news_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sportuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict yQmKPetsgIiBwTs45zkUBz3VKIy8Sd4UGnqvoXLx3C5JefItQud2tkXjmPP4Piv


-- Levend Graf — seed the interview question bank (Dutch). Idempotent: only
-- inserts when no seed questions exist yet. Run after 02_policies.sql.

insert into public.interview_questions (category, text, is_seed, locale)
select v.category, v.text, true, 'nl'
from (
  values
    ('ouders',        'Vertel eens over jouw vader. Wat voor man was hij?'),
    ('ouders',        'En je moeder — hoe zou je haar omschrijven?'),
    ('jeugd',         'Waar ben je geboren, en hoe was het huis waarin je opgroeide?'),
    ('jeugd',         'Wat is je allervroegste herinnering?'),
    ('jeugd',         'Hoe was je op school? Wat vond je leuk, en wat juist niet?'),
    ('vriendschap',   'Wie was vroeger je beste vriend of vriendin?'),
    ('liefde',        'Hoe heb je je partner leren kennen?'),
    ('liefde',        'Wanneer wist je: dit is de juiste persoon?'),
    ('kinderen',      'Vertel over de dag dat je kind werd geboren.'),
    ('werk',          'Wat voor werk heb je gedaan, en deed je het graag?'),
    ('trots',         'Waar ben je in je leven het meest trots op?'),
    ('levenslessen',  'Wat was je grootste fout, en wat heb je ervan geleerd?'),
    ('reizen',        'Wat was de mooiste reis of vakantie die je ooit maakte?'),
    ('muziek',        'Welke muziek luisterde je vroeger het liefst?'),
    ('plekken',       'Wat was jouw favoriete plek op aarde?'),
    ('karakter',      'Welke uitspraak of gewoonte was typisch voor jou?'),
    ('waarden',       'Wat vond je echt belangrijk in het leven?'),
    ('levenslessen',  'Is er iets waar je spijt van hebt?'),
    ('nalatenschap',  'Wat zou je willen dat je kleinkinderen over je weten?'),
    ('troost',        'Welk advies zou je geven aan iemand die verdriet heeft?'),
    ('geluk',         'Wat maakte je gelukkig, ook in de kleine dingen?'),
    ('karakter',      'Wie heeft jouw leven het meest gevormd?'),
    ('geluk',         'Als je één dag opnieuw mocht beleven, welke zou dat zijn?'),
    ('nalatenschap',  'Wat wil je nog zeggen tegen de mensen die je liefhebt?')
) as v(category, text)
where not exists (
  select 1 from public.interview_questions where is_seed = true
);

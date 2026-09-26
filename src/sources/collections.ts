// Bundled collections of short passages from religious, ancient and
// philosophical texts. These ship with the extension so they work offline,
// need no extra permissions, and are never rate limited.
import type { Quote } from '../quoteService'

// King James Version (public domain). Also used as the offline fallback for
// the live Bible source.
export const bibleVerses: Quote[] = [
	{ text: 'The LORD is my shepherd; I shall not want.', author: 'Psalm 23:1', source: 'Bible · KJV' },
	{ text: 'Be still, and know that I am God.', author: 'Psalm 46:10', source: 'Bible · KJV' },
	{ text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.', author: 'Psalm 118:24', source: 'Bible · KJV' },
	{ text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', author: 'Proverbs 3:5–6', source: 'Bible · KJV' },
	{ text: 'Commit thy works unto the LORD, and thy thoughts shall be established.', author: 'Proverbs 16:3', source: 'Bible · KJV' },
	{ text: 'To every thing there is a season, and a time to every purpose under the heaven.', author: 'Ecclesiastes 3:1', source: 'Bible · KJV' },
	{ text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', author: 'Isaiah 40:31', source: 'Bible · KJV' },
	{ text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', author: 'Joshua 1:9', source: 'Bible · KJV' },
	{ text: 'They are new every morning: great is thy faithfulness.', author: 'Lamentations 3:23', source: 'Bible · KJV' },
	{ text: 'What doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?', author: 'Micah 6:8', source: 'Bible · KJV' },
	{ text: 'Blessed are the peacemakers: for they shall be called the children of God.', author: 'Matthew 5:9', source: 'Bible · KJV' },
	{ text: 'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself.', author: 'Matthew 6:34', source: 'Bible · KJV' },
	{ text: 'Rejoicing in hope; patient in tribulation; continuing instant in prayer.', author: 'Romans 12:12', source: 'Bible · KJV' },
	{ text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.', author: '1 Corinthians 13:4', source: 'Bible · KJV' },
	{ text: 'I can do all things through Christ which strengtheneth me.', author: 'Philippians 4:13', source: 'Bible · KJV' },
]

// Short excerpts from the Sahih International translation.
export const quranVerses: Quote[] = [
	{ text: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', author: 'Al-Baqarah 2:152', source: "Qur'an · Sahih International" },
	{ text: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.', author: 'Al-Baqarah 2:153', source: "Qur'an · Sahih International" },
	{ text: 'And when My servants ask you concerning Me – indeed I am near.', author: 'Al-Baqarah 2:186', source: "Qur'an · Sahih International" },
	{ text: 'Allah does not charge a soul except [with that within] its capacity.', author: 'Al-Baqarah 2:286', source: "Qur'an · Sahih International" },
	{ text: 'So do not weaken and do not grieve, and you will be superior if you are [true] believers.', author: "Ali 'Imran 3:139", source: "Qur'an · Sahih International" },
	{ text: 'And whoever saves one – it is as if he had saved mankind entirely.', author: "Al-Ma'idah 5:32", source: "Qur'an · Sahih International" },
	{ text: 'Unquestionably, by the remembrance of Allah hearts are assured.', author: "Ar-Ra'd 13:28", source: "Qur'an · Sahih International" },
	{ text: "And say, 'My Lord, increase me in knowledge.'", author: 'Ta-Ha 20:114', source: "Qur'an · Sahih International" },
	{ text: 'And not equal are the good deed and the bad. Repel [evil] by that [deed] which is better.', author: 'Fussilat 41:34', source: "Qur'an · Sahih International" },
	{ text: 'O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.', author: 'Al-Hujurat 49:13', source: "Qur'an · Sahih International" },
	{ text: 'And whoever relies upon Allah – then He is sufficient for him.', author: 'At-Talaq 65:3', source: "Qur'an · Sahih International" },
	{ text: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.', author: 'Ash-Sharh 94:5–6', source: "Qur'an · Sahih International" },
]

export const gitaVerses: Quote[] = [
	{ text: 'The contacts of the senses with their objects give rise to cold and heat, pleasure and pain. They come and go and are impermanent; bear them patiently.', author: 'Bhagavad Gita 2:14', source: 'Bhagavad Gita' },
	{ text: 'The soul is never born, nor does it ever die. It is unborn, eternal, ever-existing and primeval.', author: 'Bhagavad Gita 2:20', source: 'Bhagavad Gita' },
	{ text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.', author: 'Bhagavad Gita 2:47', source: 'Bhagavad Gita' },
	{ text: 'Perform your duty equipoised, abandoning all attachment to success or failure. Such equanimity is called yoga.', author: 'Bhagavad Gita 2:48', source: 'Bhagavad Gita' },
	{ text: 'It is better to perform one’s own duty imperfectly than to perform another’s duty well.', author: 'Bhagavad Gita 3:35', source: 'Bhagavad Gita' },
	{ text: 'The wise see with equal vision a learned and humble priest, a cow, an elephant, a dog and an outcaste.', author: 'Bhagavad Gita 5:18', source: 'Bhagavad Gita' },
	{ text: 'Let a man lift himself by his own Self; let him not lower himself. For he himself is his own friend, and he himself is his own enemy.', author: 'Bhagavad Gita 6:5', source: 'Bhagavad Gita' },
	{ text: 'For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, the mind remains the greatest enemy.', author: 'Bhagavad Gita 6:6', source: 'Bhagavad Gita' },
	{ text: 'The mind is restless and hard to restrain, but it is subdued by practice and by detachment.', author: 'Bhagavad Gita 6:35', source: 'Bhagavad Gita' },
	{ text: 'A person is made by their faith. As one’s faith is, so is one.', author: 'Bhagavad Gita 17:3', source: 'Bhagavad Gita' },
]

export const taoTeChing: Quote[] = [
	{ text: 'The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 1' },
	{ text: 'The highest good is like water. Water gives life to the ten thousand things and does not strive.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 8' },
	{ text: 'Clay is fashioned into vessels; but it is on their empty hollowness that their use depends.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 11' },
	{ text: 'He who stands on tiptoe does not stand firm.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 24' },
	{ text: 'Knowing others is wisdom; knowing yourself is enlightenment.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 33' },
	{ text: 'He who conquers others is strong; he who conquers himself is mighty.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 33' },
	{ text: 'He who knows he has enough is rich.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 33' },
	{ text: 'Those who know do not speak; those who speak do not know.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 56' },
	{ text: 'Deal with the difficult while it is still easy; accomplish the great while it is still small.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 63' },
	{ text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 64' },
	{ text: 'The hard and stiff will be broken. The soft and supple will prevail.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 76' },
	{ text: 'True words are not beautiful; beautiful words are not true.', author: 'Lao Tzu', source: 'Tao Te Ching · Chapter 81' },
]

// F. Max Müller's translation (1881, public domain).
export const dhammapada: Quote[] = [
	{ text: 'All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.', author: 'Dhammapada 1', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'For hatred does not cease by hatred at any time: hatred ceases by love—this is an old rule.', author: 'Dhammapada 5', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'It is good to tame the mind, which is difficult to hold in and flighty, rushing wherever it listeth; a tamed mind brings happiness.', author: 'Dhammapada 35', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'As a solid rock is not shaken by the wind, wise people falter not amidst blame and praise.', author: 'Dhammapada 81', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'Even though a speech be a thousand words, but made up of senseless words, one word of sense is better, which if a man hears, he becomes quiet.', author: 'Dhammapada 100', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'If one man conquer in battle a thousand times thousand men, and if another conquer himself, he is the greatest of conquerors.', author: 'Dhammapada 103', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'Let no man think lightly of evil, saying in his heart, It will not come nigh unto me. Even by the falling of water-drops a water-pot is filled.', author: 'Dhammapada 121', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'Health is the greatest of gifts, contentedness the greatest riches; trust is the best of relationships, Nirvana the highest happiness.', author: 'Dhammapada 204', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'Let a man overcome anger by love, let him overcome evil by good; let him overcome the greedy by liberality, the liar by truth!', author: 'Dhammapada 223', source: 'Dhammapada · trans. Max Müller' },
	{ text: 'You yourself must make an effort. The Tathagatas are only preachers.', author: 'Dhammapada 276', source: 'Dhammapada · trans. Max Müller' },
]

// Marcus Aurelius (trans. George Long), Seneca (trans. Gummere / Basore) and
// Epictetus (trans. George Long) — all public domain translations.
export const stoics: Quote[] = [
	{ text: 'Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial.', author: 'Marcus Aurelius', source: 'Meditations 2.1' },
	{ text: 'Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.', author: 'Marcus Aurelius', source: 'Meditations 4.17' },
	{ text: 'Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.', author: 'Marcus Aurelius', source: 'Meditations 5.16' },
	{ text: 'The best way of avenging thyself is not to become like the wrong doer.', author: 'Marcus Aurelius', source: 'Meditations 6.6' },
	{ text: 'Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.', author: 'Marcus Aurelius', source: 'Meditations 7.59' },
	{ text: 'If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgement about it.', author: 'Marcus Aurelius', source: 'Meditations 8.47' },
	{ text: 'No longer talk at all about the kind of man that a good man ought to be, but be such.', author: 'Marcus Aurelius', source: 'Meditations 10.16' },
	{ text: 'Hold every hour in your grasp. Lay hold of to-day’s task, and you will not need to depend so much upon to-morrow’s.', author: 'Seneca', source: 'Letters to Lucilius 1' },
	{ text: 'It is not the man who has too little, but the man who craves more, that is poor.', author: 'Seneca', source: 'Letters to Lucilius 2' },
	{ text: 'We are more often frightened than hurt; and we suffer more from imagination than from reality.', author: 'Seneca', source: 'Letters to Lucilius 13' },
	{ text: 'It is not that we have a short space of time, but that we waste much of it.', author: 'Seneca', source: 'On the Shortness of Life' },
	{ text: 'Of things some are in our power, and others are not.', author: 'Epictetus', source: 'Enchiridion 1' },
	{ text: 'Men are disturbed not by the things which happen, but by the opinions about the things.', author: 'Epictetus', source: 'Enchiridion 5' },
]

// James Legge's translation (public domain).
export const analects: Quote[] = [
	{ text: 'Is it not pleasant to learn with a constant perseverance and application?', author: 'Confucius', source: 'Analects · Book 1' },
	{ text: 'Learning without thought is labour lost; thought without learning is perilous.', author: 'Confucius', source: 'Analects · Book 2' },
	{ text: 'When you know a thing, to hold that you know it; and when you do not know a thing, to allow that you do not know it—this is knowledge.', author: 'Confucius', source: 'Analects · Book 2' },
	{ text: 'When we see men of worth, we should think of equalling them; when we see men of a contrary character, we should turn inwards and examine ourselves.', author: 'Confucius', source: 'Analects · Book 4' },
	{ text: 'When I walk along with two others, they may serve me as my teachers.', author: 'Confucius', source: 'Analects · Book 7' },
	{ text: 'The wise are free from perplexities; the virtuous from anxiety; and the bold from fear.', author: 'Confucius', source: 'Analects · Book 9' },
	{ text: 'What the superior man seeks, is in himself. What the mean man seeks, is in others.', author: 'Confucius', source: 'Analects · Book 15' },
	{ text: 'What you do not want done to yourself, do not do to others.', author: 'Confucius', source: 'Analects · Book 15' },
]

/**
 * Every word, photo and label in the experience lives here.
 * Edit this file to change the site — no component should need touching.
 */

export type BirthdayPhoto = {
  src: string;
  /** Optional alt text for screen readers. */
  alt?: string;
};

export const birthdayConfig = {
  recipientName: 'Sof',
  fullName: 'Sofi',
  age: 23,

  meta: {
    title: 'A Little Birthday Journey',
    description: 'A small thing made for Sofi’s birthday.',
  },

  intro: {
    title: 'Hi, Buy.',
    subtitle: 'I made something for you.',
    description:
      'Nothing too serious. Just a little journey for your birthday :)',
    cta: 'START THE JOURNEY',
  },

  /** The five acts of the journey, used by the progress indicator. */
  acts: [
    'A little reminder',
    'The moment',
    'The message',
    'One more thing',
    'The journey',
  ],

  chapters: {
    chapterOne: {
      title: 'A little reminder.',
      lines: [
        'Sometimes life gets a little too loud.',
        'So take a breath, slow down a little, and give yourself some room to just be.',
        'You will get there.',
      ],
      cta: 'KEEP GOING',
    },

    chapterTwo: {
      title: 'Things worth keeping.',
      traits: [
        'Your curiosity.',
        'Your random little interests.',
        'The way you get excited about things you genuinely like.',
        "Your independence, your own way of thinking, and even the little things you probably don't think much about.",
        'Keep those.',
      ],
      closing: 'Some things don’t need to be figured out all at once.',
      cta: 'CONTINUE',
    },

    chapterThree: {
      lines: [
        'Okay…',
        'You’ve made it this far.',
        'There’s something waiting at the end.',
      ],
      cta: 'LET’S SEE',
    },
  },

  cake: {
    intro: 'Okay.',
    lead: 'You’ve made it to the important part.',
    prompt: 'Make a wish.',
    cta: 'MAKE A WISH',
    afterBlow: 'Noted. Not telling anyone.',

    /**
     * One photo, propped behind the cake like it's sitting on the table.
     * Set to null to show the cake on its own.
     */
    photo: {
      src: '/images/sofi-01.jpeg',
      alt: 'A photo of Sofi',
    } as BirthdayPhoto | null,
  },

  wishes: {
    heading: 'Happy Birthday, Buy. 🤍',
    body: `23 already, huh?

I hope this year brings you a lot of good things. new experiences, good people, exciting opportunities, and more random little moments that make you genuinely happy.

I hope you get to try new things, discover more of what you like, meet people who bring good energy into your life, and have more reasons to look forward to tomorrow.

and please don't forget to enjoy the process too. not everything has to be productive, meaningful, or planned.

sometimes, just having a good day is enough.

so yeah, happy 23, Buy.

hope this year is kind to you. 🤍`,
    cta: 'CONTINUE',
  },

  oneMoreThing: {
    opener: 'But…',
    line: 'There’s actually one more thing.',
    tease:
      'You didn’t think I’d make this whole thing just for a birthday message, did you? 👀',
    cta: 'SHOW ME',
  },

  gift: {
    heading: 'Your birthday gift is on its way. 📦',
    cardTitle: 'Your birthday gift',
    cardStatus: 'On the way',
    /** Shown on the parcel card. Keep it vague — the book should still be a surprise. */
    cardHint: 'A book. The kind you write in.',
    description:
      'I wanted to give you something you can actually keep and use.',
    secondary: 'So… I hope you’ll like it when it arrives. :)',
    cta: 'TRACK THE GIFT',
  },

  tracking: {
    title: 'Your Gift’s Journey',
    subtitle: 'Let’s see how far it has travelled.',
    courier: 'SPX Express',
    cta: 'CONTINUE',
  },

  complete: {
    heading: 'Quest Complete. 🎉',
    lines: [
      'That’s it.',
      'I hope you have a really good birthday, Buy.',
      'Now go enjoy your cake.',
      'And yes, I know you’re probably making it yourself HAHAHA.',
    ],
    signoff: 'Happy Birthday 🤍',
    cta: 'RESTART JOURNEY',
  },

  audio: {
    /** Drop an mp3 at this path to enable the music toggle. Optional. */
    src: '/audio/theme.mp3',
    enabled: true,
    label: 'Background music',
  },
} as const;

export type BirthdayConfig = typeof birthdayConfig;

export default birthdayConfig;

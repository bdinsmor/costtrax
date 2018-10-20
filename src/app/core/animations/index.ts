import {
  animate,
  animateChild,
  animation,
  group,
  keyframes,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';

const customAnimation = animation(
  [
    style({
      opacity: '{{opacity}}',
      transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})'
    }),
    animate('{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)', style('*'))
  ],
  {
    params: {
      duration: '200ms',
      delay: '0ms',
      opacity: '0',
      scale: '1',
      x: '0',
      y: '0',
      z: '0'
    }
  }
);

export const appAnimations = [
  trigger('animate', [
    transition('void => *', [useAnimation(customAnimation)])
  ]),

  trigger('animateStagger', [
    state('50', style('*')),
    state('100', style('*')),
    state('200', style('*')),

    transition(
      'void => 50',
      query('@*', [stagger('50ms', [animateChild()])], { optional: true })
    ),
    transition(
      'void => 100',
      query('@*', [stagger('100ms', [animateChild()])], { optional: true })
    ),
    transition(
      'void => 200',
      query('@*', [stagger('200ms', [animateChild()])], { optional: true })
    )
  ]),

  trigger('fadeInOut', [
    state(
      '0',
      style({
        display: 'none',
        opacity: 0
      })
    ),
    state(
      '1',
      style({
        display: 'block',
        opacity: 1
      })
    ),
    transition('1 => 0', animate('300ms ease-out')),
    transition('0 => 1', animate('300ms ease-in'))
  ]),

  trigger('slideInOut', [
    state(
      '0',
      style({
        height: '0px',
        display: 'none'
      })
    ),
    state(
      '1',
      style({
        height: '*',
        display: 'block'
      })
    ),
    transition('1 => 0', animate('300ms ease-out')),
    transition('0 => 1', animate('300ms ease-in'))
  ]),

  trigger('hideShow', [
    transition(':enter', [
      style({ backgroundColor: 'white', borderRadius: '0px' }),
      animate(300)
    ]),
    transition(':leave', [
      animate(300, style({ backgroundColor: 'white', borderRadius: '0px' }))
    ]),
    state('*', style({ backgroundColor: '#eee', borderRadius: '4px' }))
  ]),

  trigger('slideIn', [
    transition('void => left', [
      style({
        transform: 'translateX(100%)'
      }),
      animate(
        '300ms ease-in',
        style({
          transform: 'translateX(0)'
        })
      )
    ]),
    transition('left => void', [
      style({
        transform: 'translateX(0)'
      }),
      animate(
        '300ms ease-in',
        style({
          transform: 'translateX(-100%)'
        })
      )
    ]),
    transition('void => right', [
      style({
        transform: 'translateX(-100%)'
      }),
      animate(
        '300ms ease-in',
        style({
          transform: 'translateX(0)'
        })
      )
    ]),
    transition('right => void', [
      style({
        transform: 'translateX(0)'
      }),
      animate(
        '300ms ease-in',
        style({
          transform: 'translateX(100%)'
        })
      )
    ])
  ]),

  trigger('slideInLeft', [
    state(
      'void',
      style({
        transform: 'translateX(-100%)',
        display: 'none'
      })
    ),
    state(
      '*',
      style({
        transform: 'translateX(0)',
        display: 'flex'
      })
    ),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInRight', [
    state(
      'void',
      style({
        transform: 'translateX(100%)',
        display: 'none'
      })
    ),
    state(
      '*',
      style({
        transform: 'translateX(0)',
        display: 'flex'
      })
    ),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInTop', [
    state(
      'void',
      style({
        transform: 'translateY(-100%)',
        display: 'none'
      })
    ),
    state(
      '*',
      style({
        transform: 'translateY(0)',
        display: 'flex'
      })
    ),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInBottom', [
    state(
      'void',
      style({
        transform: 'translateY(100%)',
        display: 'none'
      })
    ),
    state(
      '*',
      style({
        transform: 'translateY(0)',
        display: 'flex'
      })
    ),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('expandCollapse', [
    state(
      'void',
      style({
        height: '0px'
      })
    ),
    state(
      '*',
      style({
        height: '*'
      })
    ),
    transition('void => *', animate('300ms ease-out')),
    transition('* => void', animate('300ms ease-in'))
  ]),

  trigger('routerTransitionLeft', [
    transition('* => *', [
      query(
        'app-content > :enter, app-content > :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
        ],
        { optional: true }
      ),
      query(
        'app-content > :enter',
        [
          style({
            transform: 'translateX(100%)',
            opacity: 0
          })
        ],
        { optional: true }
      ),
      sequence([
        group([
          query(
            'app-content > :leave',
            [
              style({
                transform: 'translateX(0)',
                opacity: 1
              }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateX(-100%)',
                  opacity: 0
                })
              )
            ],
            { optional: true }
          ),
          query(
            'app-content > :enter',
            [
              style({ transform: 'translateX(100%)' }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateX(0%)',
                  opacity: 1
                })
              )
            ],
            { optional: true }
          )
        ]),
        query('app-content > :leave', animateChild(), { optional: true }),
        query('app-content > :enter', animateChild(), { optional: true })
      ])
    ])
  ]),

  trigger('routerTransitionRight', [
    transition('* => *', [
      query(
        'app-content > :enter, app-content > :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
        ],
        { optional: true }
      ),
      query(
        'app-content > :enter',
        [
          style({
            transform: 'translateX(-100%)',
            opacity: 0
          })
        ],
        { optional: true }
      ),
      sequence([
        group([
          query(
            'app-content > :leave',
            [
              style({
                transform: 'translateX(0)',
                opacity: 1
              }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateX(100%)',
                  opacity: 0
                })
              )
            ],
            { optional: true }
          ),
          query(
            'app-content > :enter',
            [
              style({ transform: 'translateX(-100%)' }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateX(0%)',
                  opacity: 1
                })
              )
            ],
            { optional: true }
          )
        ]),
        query('app-content > :leave', animateChild(), { optional: true }),
        query('app-content > :enter', animateChild(), { optional: true })
      ])
    ])
  ]),

  trigger('routerTransitionUp', [
    transition('* => *', [
      query(
        'app-content > :enter, app-content > :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
        ],
        { optional: true }
      ),
      query(
        'app-content > :enter',
        [
          style({
            transform: 'translateY(100%)',
            opacity: 0
          })
        ],
        { optional: true }
      ),
      group([
        query(
          'app-content > :leave',
          [
            style({
              transform: 'translateY(0)',
              opacity: 1
            }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateY(-100%)',
                opacity: 0
              })
            )
          ],
          { optional: true }
        ),
        query(
          'app-content > :enter',
          [
            style({ transform: 'translateY(100%)' }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateY(0%)',
                opacity: 1
              })
            )
          ],
          { optional: true }
        )
      ]),
      query('app-content > :leave', animateChild(), { optional: true }),
      query('app-content > :enter', animateChild(), { optional: true })
    ])
  ]),

  trigger('routerTransitionDown', [
    transition('* => *', [
      query(
        'app-content > :enter, app-content > :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
        ],
        { optional: true }
      ),
      query(
        'app-content > :enter',
        [
          style({
            transform: 'translateY(-100%)',
            opacity: 0
          })
        ],
        { optional: true }
      ),
      sequence([
        group([
          query(
            'app-content > :leave',
            [
              style({
                transform: 'translateY(0)',
                opacity: 1
              }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateY(100%)',
                  opacity: 0
                })
              )
            ],
            { optional: true }
          ),
          query(
            'app-content > :enter',
            [
              style({ transform: 'translateY(-100%)' }),
              animate(
                '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({
                  transform: 'translateY(0%)',
                  opacity: 1
                })
              )
            ],
            { optional: true }
          )
        ]),
        query('app-content > :leave', animateChild(), { optional: true }),
        query('app-content > :enter', animateChild(), { optional: true })
      ])
    ])
  ]),

  trigger('routerTransitionFade', [
    transition(
      '* => *',
      group([
        query(
          'app-content > :enter, app-content > :leave ',
          [
            style({
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            })
          ],
          { optional: true }
        ),

        query(
          'app-content > :enter',
          [
            style({
              opacity: 0
            })
          ],
          { optional: true }
        ),
        query(
          'app-content > :leave',
          [
            style({
              opacity: 1
            }),
            animate(
              '300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                opacity: 0
              })
            )
          ],
          { optional: true }
        ),
        query(
          'app-content > :enter',
          [
            style({
              opacity: 0
            }),
            animate(
              '300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                opacity: 1
              })
            )
          ],
          { optional: true }
        ),
        query('app-content > :enter', animateChild(), { optional: true }),
        query('app-content > :leave', animateChild(), { optional: true })
      ])
    )
  ]),

  trigger('listAnimation', [
    transition('* => *', [
      query(':enter', style({ opacity: 0 }), { optional: true }),

      query(
        ':enter',
        stagger('10ms', [
          animate(
            '500ms ease-in',
            keyframes([
              style({ opacity: 0, transform: 'translateY(-5%)', offset: 0 }),
              style({
                opacity: 0.5,
                transform: 'translateY(5px)',
                offset: 0.3
              }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
            ])
          )
        ]),
        { optional: true }
      ),
      query(
        ':leave',
        stagger('10ms', [
          animate(
            '500ms ease-in',
            keyframes([
              style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
              style({
                opacity: 0.5,
                transform: 'translateY(5px)',
                offset: 0.3
              }),
              style({
                opacity: 0,
                transform: 'translateY(-5%)',
                offset: 1.0
              })
            ])
          )
        ]),
        { optional: true }
      )
    ])
  ])
];

export const ANIMATE_ON_ROUTE_ENTER = 'route-enter-staggered';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter > *', style({ opacity: 0, position: 'fixed' }), {
      optional: true
    }),
    query(':enter .' + ANIMATE_ON_ROUTE_ENTER, style({ opacity: 0 }), {
      optional: true
    }),
    sequence([
      query(
        ':leave > *',
        [
          style({ transform: 'translateY(0%)', opacity: 1 }),
          animate(
            '0.2s ease-in-out',
            style({ transform: 'translateY(-3%)', opacity: 0 })
          ),
          style({ position: 'fixed' })
        ],
        { optional: true }
      ),
      query(
        ':enter > *',
        [
          style({
            transform: 'translateY(-3%)',
            opacity: 0,
            position: 'static'
          }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateY(0%)', opacity: 1 })
          )
        ],
        { optional: true }
      )
    ]),
    query(
      ':enter .' + ANIMATE_ON_ROUTE_ENTER,
      stagger(100, [
        style({ transform: 'translateY(15%)', opacity: 0 }),
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        )
      ]),
      { optional: true }
    )
  ])
]);

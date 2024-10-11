

exports.cstoolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
        kind: 'category',
        name: 'Math',
        categorystyle: 'math_category',
        contents: [
          {
            kind: 'block',
            type: 'math_number',
            fields: {
              NUM: 123,
            },
          }],
        },
      
            
      
        {
        kind: 'category',
        name: 'Logic',
        categorystyle: 'logic_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_if',
          },
          {
            kind: 'block',
            type: 'logic_compare',
          },
          {
            kind: 'block',
            type: 'logic_operation',
          },
          {
            kind: 'block',
            type: 'logic_negate',
          },
          {
            kind: 'block',
            type: 'logic_boolean',
          },
          

        ],
      },


      {
        kind: 'category',
        name: 'Loops',
        categorystyle: 'loop_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_repeat_ext',
            inputs: {
              TIMES: {
                shadow: {
                  kind: 'block',
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
            },
          },
        ],
      },


      {
        kind: 'category',
        name: 'Custom',
        categorystyle: 'custom_category',
        contents: [
          {
            kind: 'block',
            type: 'led_on',
          },
          {
            kind: 'block',
            type: 'led_off',
          },
          {
            kind: 'block',
            type: 'delay',
          },
          
          
          {
            kind: 'block',
            type: 'while_loop',
          },
          {
            kind: 'block',
            type: 'repeat_n_times',
          },
  
        ],
      },



    ],
  };
  
describe('Tree helper', function() {
    'use strict';
    
    var data = [
        {
            link: 'tag1',
            text: 'Tag 1'
        }, {
            link: 'tag2',
            text: 'Tag 2',
            items: [
                {
                    link: 'tag2-1',
                    text: 'Tag 2.1'
                }, {
                    link: 'tag2-2',
                    text: 'Tag 2.2'
                }
            ]
        }, {
            link: 'tag3',
            text: 'Tag 3',
            items: [
                {
                    link: 'tag3-1',
                    text: 'Tag 3.1'
                }, {
                    link: 'tag3-2',
                    text: 'Tag 3.2',
                    items: [
                        {
                            link: 'tag4',
                            text: 'Tag 4'
                        }
                    ]
                }
            ]
        }, {
            link: 'tag5',
            text: 'Tag 5',
            items: [
                {
                    link: 'tag5-1',
                    text: 'Tag 5.1',
                    items: [
                        {
                            link: 'tag5-1-1',
                            text: 'Tag 5.1.1'
                        }
                    ]
                }
            ]
        }
    ];
    
    describe('Function', function() {
        it('Should be a helper function', function() {
            expect(FireTPL.helpers.tree).to.be.a('function');
        });
    });
});
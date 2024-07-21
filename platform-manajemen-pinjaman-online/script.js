let loans = [];
const RENDER_EVENT = 'render-loan-list';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('input-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const loanName = document.getElementById('input-title').value;
        const loanAmount = document.getElementById('input-sum').value;

        const newLoan = {
            id: +new Date(),
            name: loanName,
            amount: loanAmount,
            isPaid: false
        };

        loans.push(newLoan);

        const eventRender = document.createEvent('Event');
        eventRender.initEvent(RENDER_EVENT, true, true);
        document.dispatchEvent(eventRender);
    });

    const eventRender = document.createEvent('Event');
    eventRender.initEvent(RENDER_EVENT, true, true);
    document.dispatchEvent(eventRender);
});

document.addEventListener(RENDER_EVENT, function () {
    const unpaidLoansContainer = document.getElementById('daftar-belum-dibayar');
    const paidLoansContainer = document.getElementById('daftar-sudah-dibayar');

    while (unpaidLoansContainer.firstChild) {
        unpaidLoansContainer.removeChild(unpaidLoansContainer.firstChild);
    }
    while (paidLoansContainer.firstChild) {
        paidLoansContainer.removeChild(paidLoansContainer.firstChild);
    }

    for (let i = 0; i < loans.length; i++) {
        const loan = loans[i];

        const loanContainer = document.createElement('div');
        loanContainer.setAttribute('class', 'loan-item');
        loanContainer.setAttribute('id', 'loan-' + loan.id);

        const loanName = document.createElement('h3');
        loanName.innerText = loan.name;
        loanContainer.appendChild(loanName);

        const loanAmount = document.createElement('p');
        loanAmount.innerText = 'Jumlah: ' + loan.amount;
        loanContainer.appendChild(loanAmount);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus';
        deleteButton.setAttribute('class', 'delete-button');
        deleteButton.addEventListener('click', function () {
            for (let j = 0; j < loans.length; j++) {
                if (loans[j].id === loan.id) {
                    loans.splice(j, 1);
                    break;
                }
            }

            const eventRender = document.createEvent('Event');
            eventRender.initEvent(RENDER_EVENT, true, true);
            document.dispatchEvent(eventRender);
        });
        loanContainer.appendChild(deleteButton);

        if (loan.isPaid) {
            const markUnpaidButton = document.createElement('button');
            markUnpaidButton.innerText = 'Tandai Belum Dibayar';
            markUnpaidButton.setAttribute('class', 'mark-unpaid-button');
            markUnpaidButton.addEventListener('click', function () {
                for (let j = 0; j < loans.length; j++) {
                    if (loans[j].id === loan.id) {
                        loans[j].isPaid = false;
                        break;
                    }
                }

                const eventRender = document.createEvent('Event');
                eventRender.initEvent(RENDER_EVENT, true, true);
                document.dispatchEvent(eventRender);
            });
            loanContainer.appendChild(markUnpaidButton);
            paidLoansContainer.appendChild(loanContainer);
        } else {
            const markPaidButton = document.createElement('button');
            markPaidButton.innerText = 'Tandai Sudah Dibayar';
            markPaidButton.setAttribute('class', 'mark-paid-button');
            markPaidButton.addEventListener('click', function () {
                for (let j = 0; j < loans.length; j++) {
                    if (loans[j].id === loan.id) {
                        loans[j].isPaid = true;
                        break;
                    }
                }

                const eventRender = document.createEvent('Event');
                eventRender.initEvent(RENDER_EVENT, true, true);
                document.dispatchEvent(eventRender);
            });
            loanContainer.appendChild(markPaidButton);
            unpaidLoansContainer.appendChild(loanContainer);
        }
    }
});

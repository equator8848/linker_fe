export default class Throttle {

    constructor(mustExecTimes, exec, reject) {
        this.mustExecTimes = mustExecTimes;
        this.exec = exec;
        this.reject = reject;
        this.missTimes = 0;
    }

    tryExec(bias) {
        if (bias()) {
            this.exec();
        } else {
            if (this.missTimes === this.mustExecTimes) {
                this.exec();
                this.missTimes = 0;
            } else {
                this.reject();
                this.missTimes++;
            }
        }
    }
}
# Категоризация БД согласно CAP

## DragonFly:

DragonFly основана на Redis и перенимает множество его свойств. Основываясь на документации, при появлении разрыва в сети, реплики отключаются и перестают отвечать на запросы. Таким образом, это PC система.

https://www.dragonflydb.io/docs/managing-dragonfly/cluster-mode

## ScyllaDB:

В официальной документации указано, что ScyllaDB - AP-система.

https://opensource.docs.scylladb.com/stable/architecture/architecture-fault-tolerance.html

## ArenadataDB:

ArenadataDB основывается на Postgres, который является CA-системой. Т.е. ADB перестает функционировать при наличии разрывов в сети.

https://docs.arenadata.io/en/landing-adb/index.html
